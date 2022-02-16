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
import { useHistory } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const Home = () => {
  const history = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth
        .getUser()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    oktaAuth.signInWithRedirect();
  };

  if (!authState) {
    return <div>Loading...</div>;
  }

  return (
    <div id="home">
      <div>
        <Header as="h1">Welcome to the Iron Bank</Header>

        {authState.isAuthenticated && !userInfo && (
          <div>Loading user information...</div>
        )}

        {authState.isAuthenticated && userInfo && (
          <div>
            <p id="welcome">
              Welcome, &nbsp;
              {userInfo.name}!
            </p>
            <p>
              You've successfully authenticated. Currently, you're able to see
              your profile and the applications you have access to.
            </p>
          </div>
        )}

        {!authState.isAuthenticated && (
          <div>
            <p>Login to view your profile.</p>
            {/* <Button id="login-button" primary onClick={login}>
              Login
            </Button> */}
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
