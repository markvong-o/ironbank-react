/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Button, Header, Form } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';
import '../css/Admin.css';

import config from "../config";

const AdminCreate = () => {
  const { authState, oktaAuth } = useOktaAuth();

  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [message, setMessage] = useState('');

  const {clientId, redirectUri, issuer} = config.oidc;
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
    setLogin('');
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
  };

  const createUser = async (data) => {
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

    const resp = await fetch(usersUrl, app_options);
    const json = await resp.json();

    if (resp.status === 200) {
      setMessage(`User "${json.profile.login}" has been successfully created!`);
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
        firstName,
        lastName,
        email,
        login,
      },
      credentials: {
        password,
      },
    };
    createUser(data);
  };

  const handleFirst = (e) => {
    setFirstName(e.target.value);
  };

  const handleLast = (e) => {
    setLastName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleLogin = (e) => {
    setLogin(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div id="admin-create-main-container">
      <Header as="h2" id="message">
        {message}
      </Header>
      <Form onSubmit={handleSubmit} style={{ margin: '2rem' }}>
        {/* <Form.Group> */}
        <Form.Input
          placeholder="First Name"
          name="firstName"
          value={firstName}
          onChange={handleFirst}
        />
        <Form.Input
          placeholder="Last Name"
          name="lastName"
          value={lastName}
          onChange={handleLast}
        />
        <Form.Input
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleEmail}
          required
        />
        <Form.Input
          placeholder="Username"
          name="login"
          value={login}
          onChange={handleLogin}
          required
        />
        <Form.Input
          placeholder="Password"
          name="password"
          value={password}
          onChange={handlePassword}
          required
          type="password"
        />
        <Form.Button content="Create User" type="submit" />

        {/* </Form.Group> */}
      </Form>
      <Button content="Clear Fields" onClick={clearFields} />
    </div>
  );
};

export default AdminCreate;
