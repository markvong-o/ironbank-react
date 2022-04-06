/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Button, Header, Form } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import '../css/Admin.css';

import config from "../config";

const AdminCreateGroups = () => {
  const { authState, oktaAuth } = useOktaAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [message, setMessage] = useState('');

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

  useEffect(() => {}, [authState, oktaAuth]); // Update if authState changes

  const clearFields = () => {
    setName('');
    setDescription('');
  };

  const createGroup = async (data) => {
    const tokens = await localOktaAuth.token.getWithoutPrompt();
    const accessToken = tokens.tokens.accessToken.accessToken;

    const app_options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    };

    const resp = await fetch(groupsUrl, app_options);
    const json = await resp.json();

    if (resp.status === 200) {
      setMessage(`Group "${json.profile.name}" has been successfully created!`);
      document.getElementById('message').style.color = 'green';
      clearFields();
    } else {
      setMessage(`Error: ${json['errorCauses'][0]['errorSummary']}`);
      document.getElementById('message').style.color = 'red';
    }
  };

  const handleSubmit = (e) => {
    const data = {
      profile: {
        name,
        description,
      },
    };
    createGroup(data);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div id="admin-create-main-container">
      <Header as="h2" id="message">
        {message}
      </Header>
      <Form onSubmit={handleSubmit} style={{ margin: '2rem' }}>
        {/* <Form.Group> */}
        <Form.Input
          placeholder="Group Name"
          name="name"
          value={name}
          onChange={handleName}
          required
        />
        <Form.Input
          placeholder="Description"
          name="description"
          value={description}
          onChange={handleDescription}
          required
        />

        <Form.Button content="Create Group" type="submit" />

        {/* </Form.Group> */}
      </Form>
      <Button content="Clear Fields" onClick={clearFields} />
    </div>
  );
};

export default AdminCreateGroups;
