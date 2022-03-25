/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import '../css/Admin.css';

const Impersonate = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [users, setUsers] = useState([]);

  const BASENAME = process.env.PUBLIC_URL || '';
  const DOMAIN = 'https://thecrownlands.game-of-thrones.us';

  const usersUrl = `${DOMAIN}/api/v1/users`;

  const config = {
    clientId: '0oa15b5c0s76WBRdl0h8',
    issuer: DOMAIN,
    redirectUri: `${window.location.origin}${BASENAME}/login/callback`,
    scopes: [
      'openid',
      'profile',
      'email',
      'okta.users.manage',
      'okta.groups.manage',
      'okta.apps.manage',
    ],
  };

  const localOktaAuth = new OktaAuth(config);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      const request = async (method, resource) => {
        const tokens = await localOktaAuth.token.getWithoutPrompt();
        const accessToken = tokens.tokens.accessToken.accessToken;
        const app_options = {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const resp = await fetch(usersUrl, app_options);
        const json = await resp.json();

        setUsers(json);
      };
      request('GET', 'USERS');
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const isActive = async (e) => {
    const data = {
      curr: authState.idToken,
      target: e.target.innerText
    }
    
    const options = {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data)
    }

    const url = "https://okta-custom-api.glitch.me/impersonate";

    const res = await fetch(url, options);
    const json = await res.json();
    // console.log(json);
    window.open("https://okta-custom-api.glitch.me/redirect", "_blank");
  };

  return (
    <div id="admin-main-container">
      {users.length > 0 && (
        <div id="all-users-container">
          <h2>Impersonate Users</h2>
          <Button.Group className="user-btn-grp">
            {users.map((user) => (
              <Button
                id={user.id}
                key={user.id}
                className="user-btn"
                onClick={isActive}
                value={user.id}
                basic
                color="black"
              >
                {user.profile.login}
              </Button>
            ))}
          </Button.Group>
        </div>
      )}
    </div>
  );
};

export default Impersonate;
