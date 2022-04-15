/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import '../css/Admin.css';

import config from "../config";

const AdminView = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [apps, setApps] = useState([]);

  const [currGroups, setCurrGroups] = useState([]);
  const [currApps, setCurrApps] = useState([]);

  const [currUser, setCurrUser] = useState(null);

  const {clientId, issuer, redirectUri} = config.oidc;
  const DOMAIN = issuer.split("/oauth2")[0];

  const usersUrl = `${DOMAIN}/api/v1/users`;
  const groupsUrl = `${DOMAIN}/api/v1/groups`;
  const appsUrl = `${DOMAIN}/api/v1/apps`;

  const c = {
    clientId,
    issuer: DOMAIN,
    redirectUri,
    scopes: [
      'openid',
      'profile',
      'email',
      'okta.users.manage',
      'okta.groups.manage',
      'okta.apps.manage',
    ],
  };

  const localOktaAuth = new OktaAuth(c);

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
            setUsers(json);
          case 'GROUPS':
            setGroups(json);
          case 'APPS':
            setApps(json);
        }
      };
      request('GET', 'USERS');
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const getResource = async (method, user, resource) => {
    const tokens = await localOktaAuth.token.getWithoutPrompt();
    const accessToken = tokens.tokens.accessToken.accessToken;
    // let url =
    //   resource === 'GROUPS'
    //     ? `${usersUrl}/${user}/groups`
    //     : `${usersUrl}/${user}/appLinks`;
    let url =
      resource === 'GROUPS' && user == ''
        ? `${groupsUrl}`
        : resource === 'GROUPS' && user != ''
        ? `${usersUrl}/${user}/groups`
        : resource === 'APPS' && user == ''
        ? `${appsUrl}`
        : `${usersUrl}/${user}/appLinks`;

    const app_options = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const resp = await fetch(url, app_options);
    const json = await resp.json();
    return json;
    // switch (resource) {
    //   case 'GROUPS':
    //     setGroups(json);
    //   case 'APPS':
    //     setApps(json);
    // }
  };

  const isActive = async (e) => {
    setGroups([]);
    setApps([]);
    setCurrApps([]);
    setCurrGroups([]);
    e.persist();
    setCurrUser(e.target.innerText);
    const allGroups = await getResource('GET', '', 'GROUPS');
    const allApps = await getResource('GET', '', 'APPS');
    setGroups(allGroups);
    setApps(allApps);
    const currGroups = await getResource('GET', e.target.value, 'GROUPS');
    const currApps = await getResource('GET', e.target.value, 'APPS');
    setCurrApps(currApps);
    setCurrGroups(currGroups);
  };

  const handleHidden = (e) => {
    console.log(e.target);
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
                basic
                color="black"
              >
                {user.profile.login}
              </Button>
            ))}
          </Button.Group>
        </div>
      )}
      {currUser && (
        <div id="curr-user-div">
          <Header as="h2" color="black">
            {currUser}
          </Header>
          <div id="user-info-container">
            {groups.length > 0 && currGroups.length > 0 && (
              <div id="groups-container">
                <Header as="h3" color="blue">
                  Groups
                </Header>
                <Button.Group className="grp-btn-grp">
                  {groups.map((group) => {
                    // console.log(currGroups);
                    return currGroups.map((g) => g.id).includes(group.id) &&
                      group.profile.name != 'Everyone' ? (
                      <Button
                        id={group.id}
                        key={group.id}
                        className="info-btn"
                        value={group.id}
                        animated="fade"
                        color="blue"
                      >
                        <Button.Content visible>
                          {group.profile.name}
                        </Button.Content>
                        <Button.Content
                          onClick={handleHidden}
                          hidden
                          id={group.id}
                        >
                          Remove
                        </Button.Content>
                      </Button>
                    ) : group.profile.name != 'Everyone' ? (
                      <Button
                        id={group.id}
                        key={group.id}
                        className="info-btn"
                        value={group.id}
                        animated="fade"
                        inverted
                        color="red"
                      >
                        <Button.Content visible>
                          {group.profile.name}
                        </Button.Content>
                        <Button.Content
                          onClick={handleHidden}
                          hidden
                          id={group.id}
                        >
                          Add
                        </Button.Content>
                      </Button>
                    ) : (
                      ''
                    );
                  })}
                </Button.Group>
              </div>
            )}
            {apps.length > 0 && currApps.length > 0 && (
              <div id="apps-container">
                <Header as="h3" color="orange">
                  Apps
                </Header>
                <Button.Group className="apps-btn-grp">
                  {apps.map((app) => {
                    // console.log(console.log(apps, currApps));
                    // console.log(currApps.map((a) => a.id).includes(app.id), app.id);
                    return currApps
                      .map((a) => a.appInstanceId)
                      .includes(app.id) ? (
                      <Button
                        id={app.id}
                        key={app.id}
                        className="info-btn"
                        value={app.id}
                        animated="fade"
                        color="orange"
                      >
                        <Button.Content visible>{app.label}</Button.Content>
                        <Button.Content hidden>Remove</Button.Content>
                      </Button>
                    ) : (
                      <Button
                        id={app.id}
                        key={app.id}
                        className="info-btn"
                        value={app.id}
                        animated="fade"
                        inverted
                        color="red"
                      >
                        <Button.Content visible>{app.label}</Button.Content>
                        <Button.Content hidden>Add</Button.Content>
                      </Button>
                    );
                  })}
                </Button.Group>
              </div>
            )}
          </div>
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
