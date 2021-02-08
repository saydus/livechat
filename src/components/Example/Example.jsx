import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Box from 'components/Box';
import Chat from 'components/Chat';

const Example = styled.div`
  color: ${props => props.theme.palette.primary};
  font-size: 20px;
  text-align: center;
  overflow: hidden;
`;

const ExampleApp = () => {
  // const greeting = chrome.i18n.getMessage('greeting');
  const [Title, setTitle] = useState('');
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    setTitle(tabs[0].title);
  });

  return (
    <Example>
      <div
        style={{
          fontSize: 20,
          height: 60,
          fontFamily: 'BebasNeue-Regular',
          width: 500,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 50px 0',
          backgroundColor: '#E0E0E0',
          color: '#333',
          boxShadow: '0 2px 10px #bebebe',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {Title}
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: 'NunitoSans-Light',
            position: 'absolute',
            marginTop: 40,
          }}
        >
          {/* 2 Online */}
        </div>
      </div>
      <div
        style={{
          width: 600,
          height: 440,
          backgroundColor: '#E0E0E0',
          zIndex: 1,
        }}
      >
        <Chat />
      </div>
    </Example>
  );
};

export default ExampleApp;
