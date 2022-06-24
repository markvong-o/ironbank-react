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
import React, { useEffect, useRef, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { OktaAuth } from '@okta/okta-auth-js';
import config from '../config';
import '../css/Login.css';

const Login = ({ setCorsErrorModalOpen }) => {
  const { oktaAuth } = useOktaAuth();
  const widgetRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };
  const updatePassword = (e) => {
    setPassword(e.target.value);
  };
  const signIn = async () => {
    const { issuer, clientId, redirectUri } = config.oidc;
    let auth = new OktaAuth({
      clientId,
      issuer: issuer.split('/oauth2')[0],
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
    });

    const resp = await auth.signInWithCredentials({ username, password });
    if (resp.status === 'SUCCESS') {
      auth.session.setCookieAndRedirect(resp.sessionToken, '/');
    }
  };
  useEffect(() => {
    if (!widgetRef.current) {
      return false;
    }

    const { issuer, clientId, redirectUri, scopes, useInteractionCode } =
      config.oidc;
    const widget = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: issuer.split('/oauth2')[0],
      clientId,
      redirectUri,
      logo: `${process.env.PUBLIC_URL}/bank-logo.png`,
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to the Iron Bank',
        },
      },
      authParams: {
        // To avoid redirect do not set "pkce" or "display" here. OKTA-335945
        issuer,
        scopes,
      },
      useInteractionCodeFlow: useInteractionCode, // Set to true, if your org is OIE enabled
      features: {
        idpDiscovery: true,
      },
      idpDiscovery: {
        requestContext: window.location.origin,
      },
    });

    widget.renderEl(
      { el: widgetRef.current },
      (res) => {
        oktaAuth.handleLoginRedirect(res.tokens);
      },
      (err) => {
        throw err;
      }
    );

    // Note: Can't distinguish CORS error from other network errors
    const isCorsError = (err) => err.name === 'AuthApiError' && !err.statusCode;

    widget.on('afterError', (_context, error) => {
      if (isCorsError(error)) {
        setCorsErrorModalOpen(true);
      }
    });

    return () => widget.remove();
  }, [oktaAuth]);

  return (
    <div id="content">
      <div id="left-content">
        <p id="title">Welcome to the <span className="brand">Iron Bank</span></p>
        <p className="text">Our mission is to serve our community.</p>
        <p className="text">We offer the following:</p>
        <ul id="list">
          <li>Commercial Lending</li>
          <li>Personal Banking</li>
          <li>Castle Loans</li>
          <li>Dragon Loans</li>
        </ul>
        <p className="text">Talk to us today!</p>
      </div>
      <div id="right-content">
        <div ref={widgetRef} />
      </div>
    </div>
  );
};

export default Login;
