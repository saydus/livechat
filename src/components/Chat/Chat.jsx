import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';

// Import the Slate editor factory.
import { createEditor } from 'slate';

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';

import { API, Auth } from 'aws-amplify';

import { listRooms } from '../../graphql/queries';
import { createRoom as CreateRoom } from '../../graphql/mutations';
import { onCreateRoom as OnCreateRoom } from '../../graphql/subscriptions';
import { listMessagesForRoom as ListMessages } from '../../graphql/queries';
import { createMessage as CreateMessage } from '../../graphql/mutations';
import { onCreateMessageByRoomId as OnCreateMessage } from '../../graphql/subscriptions';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const sleep = m => new Promise(r => setTimeout(r, m));

export default props => {
  // Use URL to create rooms
  const [URL, setURL] = useState('');
  const [roomName, setRoomName] = useState(null);
  const [roomID, setRoomID] = useState(null);
  const [username, setUsername] = useState(null);

  // Need to implement some way to get username
  const [messages, setMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  async function createRoom(name) {
    if (!name) return;
    try {
      const room = await API.graphql({
        query: CreateRoom,
        variables: {
          input: {
            name,
          },
        },
      });
      return room;
    } catch (err) {
      return false;
    }
  }

  async function fetchRooms(currRoomName) {
    try {
      const roomData = await API.graphql({
        query: listRooms,
        variables: { limit: 1000 },
      });
      console.log('roomData: ', roomData);
      const { items } = roomData.data.listRooms;
      for (let i = 0; i < items.length; i += 1) {
        if (items[i].name === currRoomName) {
          console.log(items[i].name === currRoomName);
          console.log([items[i].name, currRoomName]);
          setRoomName(items[i].name);
          setRoomID(items[i].id);
          return;
        }
      }
      const room = await createRoom(currRoomName);
      if (!room) {
        //Handle error
        console.log('Could not create room');
      } else {
        setRoomName(room.data.createRoom.name);
        setRoomID(room.data.createRoom.id);
        return;
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  function subscribe() {
    subscription = API.graphql({
      query: OnCreateRoom,
    }).subscribe({
      next: roomData => {
        console.log({ roomData });
      },
    });
  }

  function subscribeOnMessage() {
    subscription = API.graphql({
      query: OnCreateMessage,
      variables: {
        roomId: roomID,
      },
    }).subscribe({
      next: async subscriptionData => {
        const {
          value: {
            data: { onCreateMessageByRoomId },
          },
        } = subscriptionData;
        const currentUser = await Auth.currentAuthenticatedUser();
        if (onCreateMessageByRoomId.owner === currentUser.username) return;
      },
    });
  }

  async function updateUsername() {
    const user = await Auth.currentAuthenticatedUser();
    setUsername(user.username);
  }

  let subscription;
  let subscriptionMsg;
  useEffect(() => {
    updateUsername();
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      setURL(tabs[0].url);
      fetchRooms(tabs[0].url);
      subscribe();
      subscribeOnMessage();
    });
    const refreshInterval = setInterval(() => {
      if (!roomID) return;
      listMessages();
    }, 1000);
    return () => {
      subscription.unsubscribe();
      subscriptionMsg.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [roomID]);

  async function listMessages() {
    try {
      const messageData = await API.graphql({
        query: ListMessages,
        variables: {
          roomId: roomID,
          sortDirection: 'ASC',
        },
      });
      console.log(messageData);
      setMessages(messageData.data.listMessagesForRoom.items);
      // executeScroll();
    } catch (err) {
      console.log('error fetching messages: ', err);
    }
  }
  async function createMessage(message) {
    // if (!inputValue) return;
    try {
      await API.graphql({
        query: CreateMessage,
        variables: {
          input: message,
        },
      });
      console.log('message created!');
    } catch (err) {
      console.log('error creating message: ', err);
    }
  }

  // TODO: Faking message fetch for now
  const fetchMessages = async () => {
    if (!roomID) return;
    setIsFetching(true);
    await listMessages();
    setIsFetching(false);
  };

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const onSend = async () => {
    if (!value[0].children[0].text || !value[0].children[0].text.trim()) return;
    let newMessage = {
      owner: username,
      content: value[0].children[0].text.trim(),
      roomId: roomID,
    };
    setValue([
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ]);

    await createMessage(newMessage);
    await fetchMessages();
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 250);

    if (isFetching) setIsFetching(false);
  }, [messages]);

  const scrollToBottom = () => {
    var messagesRef = document.getElementById('messages');
    messagesRef.scroll({
      top: messagesRef.scrollHeight,
      behavior: 'smooth',
    });
  };
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        style={{
          padding: '10px 50px',
          height: '75%',
          overflowY: 'scroll',
        }}
        id="messages"
      >
        {isFetching ? (
          <div class="loader">Loading...</div>
        ) : (
          <>
            {messages.map(item => (
              <ChatBubble item={item} self={item.owner === username} />
            ))}
          </>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          margin: '10px 50px',
          justifyContent: 'space-between',
          height: 100,
        }}
      >
        <TextInputWrapper>
          <Slate
            editor={editor}
            value={value}
            onChange={newValue => setValue(newValue)}
            style={{ height: '100%', width: '100%' }}
          >
            <TextInput placeholder="Send a message..." />
          </Slate>
        </TextInputWrapper>
        <SendButton onClick={onSend}>Send</SendButton>
      </div>
    </div>
  );
};

const ChatBubble = ({ item, self }) => {
  const BGColor = stringToColour(item.owner);
  const color = getColorByBgColor(BGColor);
  return (
    <div style={{ margin: '10px 0 20px', display: 'flex', flexDirection: 'column' }}>
      <Title self={self}>{item.owner}</Title>
      <ChatContainer self={self} BGColor={BGColor} color={color}>
        {item.content}
      </ChatContainer>
      <Timestamp self={self}>{dayjs(item.createdAt).fromNow()}</Timestamp>
    </div>
  );
};

const stringToColour = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

const getColorByBgColor = bgColor => {
  if (!bgColor) {
    return '';
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff';
};

const ChatContainer = styled.div`
  background: ${props => (props.self ? '#F8F9F9' : props.BGColor)};
  color: ${props => (props.self ? '#333' : props.color)};
  margin-left: ${props => (props.self ? '50px' : '0')};
  margin-right: ${props => (props.self ? '0' : '50px')};
  box-shadow: 2px 2px 5px #bebebe, -2px -2px 5px #ffffff;
  border-radius: ${props => (props.self ? '12px 5px 12px 12px' : '5px 12px 12px 12px')};
  font-family: NunitoSans-Light;
  padding: 10px;
  font-size: 12px;
  text-align: left;
  display: inline-block;
  align-self: ${props => (props.self ? 'flex-end' : 'flex-start')};
  margin: 2px 0;
`;
const Title = styled.div`
  font-size: 14px;
  font-family: BebasNeue-Regular;
  text-align: ${props => (props.self ? 'right' : 'left')};
  color: #888;
`;
const Timestamp = styled.div`
  font-size: 10px;
  font-family: NunitoSans-Light;
  text-align: ${props => (props.self ? 'right' : 'left')};
  color: #888;
`;

const TextInput = styled(Editable)`
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const TextInputWrapper = styled.div`
  background: #e0e0e0;
  color: #333;
  box-shadow: inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff;
  border-radius: 12px;
  font-family: NunitoSans-Light;
  padding: 10px;
  font-size: 12px;
  text-align: left;
  display: flex;
  height: 40px;
  width: 80%;
`;

const SendButton = styled.button`
  background: linear-gradient(145deg, #f0f0f0, #cacaca);
  color: #333;
  box-shadow: 2px 2px 5px #bebebe, 2px -2px 5px #ffffff;
  border-radius: 12px;
  font-family: BebasNeue-Regular;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  border: none;
  outline: none;
  &:active {
    background: linear-gradient(145deg, #cacaca, #f0f0f0);
  }
  width: 60px;
  height: 40px;
  margin-top: 2px;
`;
