/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Header, Icon, Table } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';

const Api = () => {
  const BASENAME = process.env.PUBLIC_URL || '';
  const { authState, oktaAuth } = useOktaAuth();
  const [accessToken, setAccessToken] = useState(null);
  const localOktaAuth = new OktaAuth({
    issuer:
      'https://thecrownlands.game-of-thrones.us/oauth2/aus15e1wayoqWUfq40h8',
    scopes: ['openid', 'profile', 'email'],
    clientId: '0oa15b5c0s76WBRdl0h8',
    redirectUri: `${window.location.origin}${BASENAME}/login/callback`,
  });

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
    } else {
      (async () => {
        const res = await localOktaAuth.token.getWithoutPrompt();
        setAccessToken(res.tokens.accessToken.accessToken);
      })();
    }
  }, [authState, oktaAuth]); // Update if authState changes

  if(!accessToken) {
      return (
          <div>Fetching access token...</div>
      )
  }
  return (
    <div>
      <div>
        <Header as="h1">
          <Icon name="openid" color="yellow" /> Access Token{' '}
        </Header>

        {accessToken && (
          <textarea
            style={{
              width: '100%',
              textWrap: 'wrap',
              height: '300px',
            }}
            value={accessToken}
            readOnly
          >
          </textarea>
        )}
      </div>
    </div>
  );
};

export default Api;
