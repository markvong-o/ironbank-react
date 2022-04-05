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
  const [isAdmin, setAdmin] = useState(false);
  // Note: Can't distinguish CORS error from other network errors
  const isCorsError = (err) =>
    err.name === 'AuthApiError' &&
    !err.errorCode &&
    err.xhr.message === 'Failed to fetch';

  const login = async () => {
    history.push('/login');
    // oktaAuth.signInWithRedirect({ originalUri: '/' });
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
  const DOMAIN = 'https://nike.okta-preview.tk';
  const config = {
    clientId: '0oa16pc7zf65PE2ny0h8',
    issuer: DOMAIN,
    redirectUri: `${window.location.origin}${BASENAME}/login/callback`,
    scopes: ['openid', 'profile', 'email'],
  };

  const localOktaAuth = new OktaAuth(config);

  useEffect(() => {
    const checkAdmin = async () => {
      const data = {
        uid: `${authState.accessToken.claims.uid}`,
      };

      const app_options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      };

      const url = 'https://okta-custom-api.glitch.me/verifyAdmin';
      const resp = await fetch(url, app_options);
      const json = await resp.json();
      // console.log(json);
      setAdmin(json['isAdmin']);
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
      <Menu fixed="top" id="menu">
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
              src={`${process.env.PUBLIC_URL}/nike-logo.png`}
            />
            &nbsp;
            <Link to="/" style={{ color: 'black' }}>
              Nike
            </Link>
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
            {authState.isAuthenticated && isAdmin && (
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
              <Menu.Item
                onClick={() => {
                  window.location.href = '/login/us';
                }}
              >
                Login
              </Menu.Item>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item
                onClick={() => {
                  window.location.href = '/login/jp';
                }}
              >
                ログインする
              </Menu.Item>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item
                onClick={() => {
                  window.location.href = '/login/ar';
                }}
              >
                Iniciar Sesión
              </Menu.Item>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item onClick={() => localOktaAuth.signInWithRedirect()}>
                Login Redirect
              </Menu.Item>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item onClick={() => {
                localOktaAuth.options.clientId = "0oa16pc0pm5EhCluP0h8";
                localOktaAuth.signInWithRedirect();
              }}>
                Iniciar Sesión Redirigir
              </Menu.Item>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item onClick={() => {
                localOktaAuth.options.clientId = "0oa16pc6mjt4zgOxi0h8";
                localOktaAuth.signInWithRedirect();
              }}>
                Login to Gatorade
              </Menu.Item>
            )}
          </div>
        </Container>
      </Menu>
    </div>
  );
};
export default Navbar;
