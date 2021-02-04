import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';

// Import the Slate editor factory.
import { createEditor } from 'slate';

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const sleep = m => new Promise(r => setTimeout(r, m));

export default props => {
  // Use URL to create rooms
  const [URL, setURL] = useState('');
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    setURL(tabs[0].url);
  });

  // Need to implement some way to get username
  const username = 'saydus';
  const [messages, updateMessages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // TODO: Faking message fetch for now
  const fetchMessages = async () => {
    setIsFetching(true);
    await sleep(2000);
    updateMessages(
      messages.concat([
        {
          from: 'jakazzy',
          msg: 'Hi! 👋',
          timestamp: dayjs(),
        },
        {
          from: 'saydus',
          msg: 'Hello Jida!',
          timestamp: dayjs(),
        },
        {
          from: 'thehanimo',
          msg: 'Hi everyone!',
          timestamp: dayjs(),
        },
        {
          from: 'thehanimo',
          msg: "How's the back-end coming along?",
          timestamp: dayjs(),
        },
        {
          from: 'jakazzy',
          msg: 'Pretty good!',
          timestamp: dayjs(),
        },
      ])
    );
  };

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);
  const onSend = () => {
    let newMessage = {
      from: username,
      msg: value[0].children[0].text,
      timestamp: dayjs(),
    };
    updateMessages(messages.concat(newMessage));
    setValue([
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ]);
  };

  useEffect(() => {
    scrollToBottom();
    if (isFetching) setIsFetching(false);
  }, [messages]);

  useEffect(fetchMessages, []);

  const scrollToBottom = () => {
    var messagesRef = document.getElementById('messages');
    messagesRef.scrollTop = messagesRef.offsetHeight;
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
              <ChatBubble item={item} self={item.from === username} />
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

const ChatBubble = ({ item, self }) => (
  <div style={{ margin: '10px 0 20px', display: 'flex', flexDirection: 'column' }}>
    <Title self={self}>{item.from}</Title>
    <ChatContainer self={self}>{item.msg}</ChatContainer>
    <Timestamp self={self}>{item.timestamp.fromNow()}</Timestamp>
  </div>
);

const ChatContainer = styled.div`
  background: ${props => (props.self ? '#F8F9F9' : '#5E86F2')};
  color: ${props => (props.self ? '#333' : '#FFF')};
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
