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
import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { Header, Icon, Table } from 'semantic-ui-react';
import { getTokenSourceMapRange } from 'typescript';
import '../css/Applications.css';

const Applications = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [apps, setApps] = useState([]);
  const BASENAME = process.env.PUBLIC_URL || '';
  const config = {
    clientId: '0oa15b5c0s76WBRdl0h8',
    issuer: 'https://thecrownlands.game-of-thrones.us',
    redirectUri: `${window.location.origin}${BASENAME}/login/callback`,
    scopes: ['openid', 'profile', 'email', 'okta.users.read.self'],
  };

  const localOktaAuth = new OktaAuth(config);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      const getApps = async () => {
        const tokens = await localOktaAuth.token.getWithoutPrompt();
        const accessToken = tokens.tokens.accessToken.accessToken;

        const url =
          'https://thecrownlands.game-of-thrones.us/api/v1/users/me/appLinks';
        const app_options = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const apps_resp = await fetch(url, app_options);
        const apps_json = await apps_resp.json();
        setApps(apps_json);
      };

      const tokens = getApps();

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

  if (apps.length === 0) {
    return (
      <div>
        <p>Fetching applications...</p>
      </div>
    );
  }

  return (
    <div>
      <div id="main-app-container">
        <Header as="h1">
          <Icon name="medapps" color="teal" /> My Applications{' '}
        </Header>
        <p>Below are the applications you have access to.</p>

        <ul>
          {apps.length > 0 &&
            apps.map((app) => {
              // console.log(app);
              return (
                <li key={app.id}>
                  <a href={app.linkUrl} target="_blank">
                    <img src={app.logoUrl} />
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Applications;
