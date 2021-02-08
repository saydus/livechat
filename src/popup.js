import 'libs/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Box from 'components/Box';
import Example from 'components/Example';
import defaultTheme from 'themes/default';
import './index.css';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { Auth, Hub } from 'aws-amplify';

import config from './aws-exports';

Amplify.configure(config);

const Popup = () => {
  const [user, updateUser] = React.useState(null);
  React.useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(() => console.log('No signed in user.'));
    Hub.listen('auth', data => {
      switch (data.payload.event) {
        case 'signIn':
          return updateUser(data.payload.data);
        case 'signOut':
          return updateUser(null);
      }
    });
  }, []);
  if (user) {
    return (
      <ThemeProvider theme={defaultTheme}>
        <Example />
      </ThemeProvider>
    );
  }
  return (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[{ type: 'username' }, { type: 'password' }, { type: 'email' }]}
      />
    </AmplifyAuthenticator>
  );
};

const root = document.createElement('div');
document.body.style.margin = 0;
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
