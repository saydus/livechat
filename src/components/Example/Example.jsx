import React, { useState } from 'react';
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

  return (
    <Example>
      <div style={{ width: 300 }}>
        <Box display="flex" alignItems="center">
          <img src={PickleRick} width={50} height={50} />
          <div>{greeting}</div>
        </Box>
        <div style={{ fontSize: 11 }}>Current tab: {URL}</div>
      </div>
    </Example>
  );
};
