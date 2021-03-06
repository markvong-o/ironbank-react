/*
 * Copyright (c) 2018-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
/*eslint-disable*/
import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Container, Image, Menu } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';

const Navbar = ({ setCorsErrorModalOpen }) => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [adminRoles, setAdminRoles] = useState([]);
  // Note: Can't distinguish CORS error from other network errors
  const isCorsError = (err) =>
    err.name === 'AuthApiError' &&
    !err.errorCode &&
    err.xhr.message === 'Failed to fetch';

  const login = async () => {
    // history.push("/login");
    oktaAuth.signInWithRedirect({ originalUri: '/' });
  };

  const logout = async () => {
    const basename =
      window.location.origin + history.createHref({ pathname: '/' });
    try {
      await oktaAuth.signOut({ postLogoutRedirectUri: basename });
    } catch (err) {
      if (isCorsError(err)) {
        setCorsErrorModalOpen(true);
      } else {
        throw err;
      }
    }
  };

  const BASENAME = process.env.PUBLIC_URL || '';
  const DOMAIN = 'https://thecrownlands.game-of-thrones.us';
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
      'okta.roles.manage',
    ],
  };

  const localOktaAuth = new OktaAuth(config);

  useEffect(() => {
    const checkAdmin = async () => {
      const tokens = await localOktaAuth.token.getWithoutPrompt();
      const accessToken = tokens.tokens.accessToken.accessToken;
      const app_options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const url = `https://thecrownlands.game-of-thrones.us/api/v1/users/${authState.accessToken.claims.uid}/roles`;
      const resp = await fetch(url, app_options);
      const json = await resp.json();
      // console.log(json);
      setAdminRoles(json);
    };
    if (authState && authState.isAuthenticated) {
      checkAdmin();
    }
  }, [oktaAuth, authState]);

  if (!authState) {
    return null;
  }

  return (
    <div>
      <Menu fixed="top" inverted id="menu">
        <Container
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Menu.Item header>
            <Image
              size="mini"
              src={`${process.env.PUBLIC_URL}/bank-logo.png`}
            />
            &nbsp;
            <Link to="/">Iron Bank</Link>
          </Menu.Item>
          <div style={{ display: 'flex' }}>
            {authState.isAuthenticated && (
              <Menu.Item id="profile-button">
                <Link to="/profile">Profile</Link>
              </Menu.Item>
            )}
            {authState.isAuthenticated && (
              <Menu.Item id="apps-button">
                <Link to="/apps">Applications</Link>
              </Menu.Item>
            )}
            {authState.isAuthenticated && (
              <Menu.Item id="api-button">
                <Link to="/balance">Check Balance</Link>
              </Menu.Item>
            )}
            {authState.isAuthenticated && adminRoles.length > 0 && (
              <Menu.Item id="api-button">
                <Link to="/admin">Admin Portal</Link>
              </Menu.Item>
            )}

            {authState.isAuthenticated && (
              <Menu.Item id="logout-button" onClick={logout}>
                Logout
              </Menu.Item>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item onClick={login}>Login</Menu.Item>
            )}
          </div>
        </Container>
      </Menu>
    </div>
  );
};
export default Navbar;
