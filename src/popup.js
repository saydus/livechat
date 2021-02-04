import 'libs/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Box from 'components/Box';
import Example from 'components/Example';
import defaultTheme from 'themes/default';
import './index.css';

const Popup = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Example />
    </ThemeProvider>
  );
};

const root = document.createElement('div');
document.body.style.margin = 0;
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
