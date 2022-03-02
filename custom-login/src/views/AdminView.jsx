/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import '../css/Admin.css';

const AdminView = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [apps, setApps] = useState([]);
  const [currUser, setCurrUser] = useState(null);

  const BASENAME = process.env.PUBLIC_URL || '';
  const DOMAIN = 'https://thecrownlands.game-of-thrones.us';

  const usersUrl = `${DOMAIN}/api/v1/users`;
  const groupsUrl = `${DOMAIN}/api/v1/groups`;
  const appsUrl = `${DOMAIN}/api/v1/apps`;

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

        const url =
          resource === 'USERS'
            ? usersUrl
            : resource === 'GROUPS'
            ? groupsUrl
            : appsUrl;
        // console.log(url);
        const app_options = {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const resp = await fetch(url, app_options);
        const json = await resp.json();

        switch (resource) {
          case 'USERS':
            // console.log(json);
            setUsers(json);
          case 'GROUPS':
            // console.log(json);
            setGroups(json);
          case 'APPS':
            // console.log(json);
            setApps(json);
        }
      };
      request('GET', 'USERS');
      //   request('GET', 'GROUPS');
      //   request('GET', 'APPS');
    }
  }, [authState, oktaAuth]); // Update if authState changes

  //   if (users.length <= 0 || groups.length <= 0 || apps.length <= 0) {
  //     return 'Loading data...';
  //   }

  const getResource = async (method, user, resource) => {
    const tokens = await localOktaAuth.token.getWithoutPrompt();
    const accessToken = tokens.tokens.accessToken.accessToken;
    let url =
      resource === 'GROUPS'
        ? `${usersUrl}/${user}/groups`
        : `${usersUrl}/${user}/appLinks`;

    const app_options = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    // console.log(url);
    const resp = await fetch(url, app_options);
    const json = await resp.json();
    switch (resource) {
      case 'GROUPS':
        setGroups(json);
      case 'APPS':
        setApps(json);
    }
  };

  const isActive = (e) => {
    // console.log(e.target.value);
    setCurrUser(e.target.innerText);
    setGroups([]);
    setApps([]);
    getResource('GET', e.target.value, 'GROUPS');
    getResource('GET', e.target.value, 'APPS');
    // console.log(e.target);
  };

  return (
    <div id="admin-main-container">
      {users.length > 0 && (
        <div id="all-users-container">
          <h2>All Users</h2>
          <Button.Group className="user-btn-grp">
            {users.map((user) => (
              <Button
                id={user.id}
                key={user.id}
                className="user-btn"
                onClick={isActive}
                value={user.id}
                // animated="fade"
                // inverted color="brown"
                basic color="black"
              >
                {user.profile.login}
              </Button>
            ))}
          </Button.Group>
        </div>
      )}
      {currUser && (
        <div id="curr-user-div">
          <Header as="h2" color="black">{currUser}</Header>
          {groups.length > 0 && (
            <div>
              <Header as="h3" color="blue">Groups</Header>
              <Button.Group className="grp-btn-grp">
                {groups.map((group) => (
                  <Button
                    id={group.id}
                    key={group.id}
                    className="user-btn"
                    value={group.id}
                    animated="fade"
                    inverted color="blue"
                  >
                    <Button.Content visible>{group.profile.name}</Button.Content>
                    <Button.Content  hidden>Remove</Button.Content>
                  </Button>
                ))}
              </Button.Group>
            </div>
          )}
          {apps.length > 0 && (
            <div>
              <Header as="h3" color="orange">Apps</Header>
              <Button.Group className="apps-btn-grp">
                {apps.map((app) => (
                  <Button
                    id={app.id}
                    key={app.id}
                    className="user-btn"
                    value={app.id}
                    animated="fade"
                    inverted color="orange"
                  >
                    <Button.Content visible>{app.label}</Button.Content>
                    <Button.Content hidden>Remove</Button.Content>
                  </Button>
                ))}
              </Button.Group>
            </div>
          )}
        </div>
      )}
      {/* <h2>Users</h2>
      <ul className="admin-ul">
        {users.length > 0 &&
          users.map((user) => (
            <button key={user.id}>{user.profile.login}</button>
          ))}
      </ul>
      <h2>Groups</h2>
      <ul>
        {groups.length > 0 &&
          groups.map((group) => (
            <button key={group.id}>{group.profile.name}</button>
          ))}
      </ul>
      <h2>Apps</h2>
      <ul>
        {apps.length > 0 &&
          apps.map((app) => <button key={app.id}>{app.label}</button>)}
      </ul> */}
    </div>
  );
};

export default AdminView;
