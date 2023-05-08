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
import { Container, Image, Menu, Dropdown } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import config from './config';

const Navbar = ({ setCorsErrorModalOpen }) => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [adminRoles, setAdminRoles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Note: Can't distinguish CORS error from other network errors
  const isCorsError = (err) =>
    err.name === 'AuthApiError' &&
    !err.errorCode &&
    err.xhr.message === 'Failed to fetch';

  const loginRedirect = async () => {
    oktaAuth.signInWithRedirect({ originalUri: '/' });
  };

  const loginLocally = async () => {
    history.push('/login');
  };

  const logout = async () => {
    const basename =
      window.location.origin + history.createHref({ pathname: '/' });
    const idToken = oktaAuth.getIdToken();
    const decodedIdToken = oktaAuth.token.decode(idToken);
    let region = decodedIdToken.payload['region'];
    let url =
      region === 'US'
        ? `https://us.mark-vong.com/login/signout`
        : `https://eu.mark-vong.com/login/signout`;

    // url = `${url}&post_logout_redirect_uri=https://ironbank.vercel.app`;
    oktaAuth.tokenManager.clear();
    window.location.href = `https://okta.mark-vong.com/oauth2/default/v1/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${url}&fromURI=${basename}`;
    // try {
    //   await oktaAuth.signOut({ postLogoutRedirectUri: url });
    // } catch (err) {
    //   if (isCorsError(err)) {
    //     setCorsErrorModalOpen(true);
    //   } else {
    //     throw err;
    //   }
    // }
  };

  useEffect(() => {
    const { issuer, clientId, redirectUri } = config.oidc;
    const BASENAME = process.env.PUBLIC_URL || '';
    const c = {
      clientId,
      issuer: issuer.split('/oauth2')[0],
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
    };
    const localOktaAuth = new OktaAuth(c);

    const checkAdmin = async () => {
      let user = await oktaAuth.getUser();
      let url = `${process.env.REACT_APP_API_URL}/api/checkAdmin`;
      let data = {
        uid: user.sub,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      };

      let res = await fetch(url, options);
      let json = await res.json();
      setIsAdmin(json.isAdmin);
    };
    if (authState && authState.isAuthenticated) {
      checkAdmin();
    }
  }, [oktaAuth, authState]);

  if (!authState) {
    return null;
  }

  const nav = (region) => {
    if (region === 'US') {
      window.location.href = 'https://us.mark-vong.com';
    } else if (region === 'EU') {
      window.location.href = 'https://eu.mark-vong.com';
    }
  };

  return (
    <div>
      <Menu inverted id="menu">
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
              <Menu.Item>
                <Dropdown text="Region">
                  <Dropdown.Menu>
                    <Dropdown.Item text="US" onClick={() => nav('US')} />
                    <Dropdown.Item text="EU" onClick={() => nav('EU')} />
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            )}
            {/* {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item onClick={loginRedirect}>Login with Redirect</Menu.Item>
            )}
            {!authState.isPending && !authState.isAuthenticated && (
              <Menu.Item onClick={loginLocally}>Login</Menu.Item>
            )} */}
          </div>
        </Container>
      </Menu>
    </div>
  );
};
export default Navbar;
