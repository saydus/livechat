import React, { useState, useMemo } from 'react';
// Import the Slate editor factory.
import { createEditor } from 'slate';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';
import styled from 'styled-components';
import Box from 'components/Box';
import Logo from 'assets/icons/logo.svg';
import PickleRick from 'assets/img/pickle-rick.jpg';

const Example = styled.div`
  color: ${props => props.theme.palette.primary};
  font-size: 20px;
  text-align: center;
`;

export default () => {
  const greeting = chrome.i18n.getMessage('greeting');
  const [URL, setURL] = useState('');
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    setURL(tabs[0].url);
    // use `url` here inside the callback because it's asynchronous!
  });

  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text contained in Slate.js.\n Click to edit!' }],
    },
  ]);
  return (
    <Example>
      <div style={{ width: 400 }}>
        <Box display="flex" alignItems="center">
          <img src={PickleRick} width={50} height={50} />
          <div>{greeting}</div>
        </Box>
        <div style={{ fontSize: 11 }}>Current tab: {URL}</div>
        <div
          style={{
            background: '#EEE',
            padding: 16,
            borderRadius: 20,
            marginTop: 30,
            color: '#333',
          }}
        >
          <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
            <Editable />
          </Slate>
        </div>
      </div>
    </Example>
  );
};
