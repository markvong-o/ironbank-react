/*eslint-disable*/

import AdminView from './AdminView';
import AdminCreate from './AdminCreate';
import AdminCreateGroups from './AdminCreateGroups';
import { Button } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import React, { useEffect, useState } from 'react';

import config from '../config';
import '../css/Admin.css';

const Admin = () => {
  let [view, setView] = useState(false);
  let [create, setCreate] = useState(false);
  let [createG, setCreateG] = useState(false);
  const { clientId, issuer, redirectUri } = config.oidc;
  const DOMAIN = issuer.split('/oauth2')[0];

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

  return (
    <div id="admin-main-container">
      <Button.Group className="user-btn-grp" style={{ marginBottom: '3rem' }}>
        <Button
          onClick={() => {
            setView(true);
            setCreate(false);
            setCreateG(false);
          }}
          basic
          color="black"
        >
          View Users
        </Button>
        <Button
          onClick={() => {
            setView(false);
            setCreate(true);
            setCreateG(false);
          }}
          basic
          color="black"
        >
          Create Users
        </Button>
        <Button
          onClick={() => {
            setView(false);
            setCreate(false);
            setCreateG(true);
          }}
          basic
          color="black"
        >
          Create Groups
        </Button>
        <Button
          onClick={() => {
            window.open(
              `${
                process.env.REACT_APP_ISSUER.split('/oauth2')[0]
              }/home/admin-entry`,
              '_blank'
            );
          }}
          basic
          color="blue"
        >
          Okta Admin Console
        </Button>
      </Button.Group>
      {view && <AdminView />}
      {create && <AdminCreate />}
      {createG && <AdminCreateGroups />}
    </div>
  );
};

export default Admin;
