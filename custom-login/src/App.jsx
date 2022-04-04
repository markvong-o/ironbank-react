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
import React from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { Container } from 'semantic-ui-react';
import config from './config';
import Home from './views/Home';
import CustomLoginComponent from './views/Login';
import Messages from './Messages';
import Navbar from './Navbar';
import Profile from './views/Profile';
import Applications from './views/Applications';
import Api from './views/Api';
import Admin from './views/Admin';
import CorsErrorModal from './CorsErrorModal';
import AuthRequiredModal from './AuthRequiredModal';
import './App.css';

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
  const [corsErrorModalOpen, setCorsErrorModalOpen] = React.useState(false);
  const [authRequiredModalOpen, setAuthRequiredModalOpen] =
    React.useState(false);

  const language = 'en';
  const logo = `${process.env.PUBLIC_URL}/nike-logo.png`;

  const history = useHistory(); // example from react-router

  const triggerLogin = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    // history.push('/login');
    oktaAuth.signInWithRedirect();
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  // Check if Okta session exists, set tokens if it does
  oktaAuth.session
    .exists()
    .then(async (exists) => {
      if (exists) {
        const res = await oktaAuth.token.getWithoutPrompt();
        oktaAuth.tokenManager.setTokens(res.tokens);
      }
    })
    .catch((err) => console.log(err));

  const customAuthHandler = async () => {
    const previousAuthState = oktaAuth.authStateManager.getPreviousAuthState();
    if (!previousAuthState || !previousAuthState.isAuthenticated) {
      // App initialization stage
      triggerLogin();
    } else {
      // Ask the user to trigger the login process during token autoRenew process
      setAuthRequiredModalOpen(true);
    }
  };

  const onAuthResume = async () => {
    history.push('/');
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Navbar {...{ setCorsErrorModalOpen }} />
      <CorsErrorModal {...{ corsErrorModalOpen, setCorsErrorModalOpen }} />
      <AuthRequiredModal
        {...{ authRequiredModalOpen, setAuthRequiredModalOpen, triggerLogin }}
      />
      <Container text id="main-container">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login/callback" component={LoginCallback} />
          {/* <Route
            path="/login/callback"
            render={(props) => (
              <LoginCallback />
            )}
          /> */}

          <Route
            exact
            path="/login/us"
            render={() => (
              <CustomLoginComponent
                {...{ setCorsErrorModalOpen, language: 'en', logo }}
              />
            )}
          />
          <Route
            exact
            path="/login/jp"
            render={() => (
              <CustomLoginComponent
                {...{ setCorsErrorModalOpen, language: 'ja', logo }}
              />
            )}
          />
          <Route
            exact
            path="/login/ar"
            render={() => (
              <CustomLoginComponent
                {...{ setCorsErrorModalOpen, language: 'es', logo }}
              />
            )}
          />
          <Route
            path="/login"
            render={() => (
              <CustomLoginComponent
                {...{ setCorsErrorModalOpen, language, logo }}
              />
            )}
          />
          <Route
            path="/footlocker"
            render={() => (
              <CustomLoginComponent
                {...{
                  setCorsErrorModalOpen,
                  language,
                  logo: `${process.env.PUBLIC_URL}/footlocker-logo.png`,
                }}
              />
            )}
          />
          <Route
            path="/gatorade"
            render={() => (
              <CustomLoginComponent
                {...{
                  setCorsErrorModalOpen,
                  language,
                  logo: `${process.env.PUBLIC_URL}/gatorade-logo.png`,
                }}
              />
            )}
          />
          <Route
            path="/usa"
            render={() => (
              <CustomLoginComponent
                {...{
                  setCorsErrorModalOpen,
                  language,
                  logo: `${process.env.PUBLIC_URL}/usa-logo.png`,
                }}
              />
            )}
          />
          <SecureRoute path="/messages" component={Messages} />
          <SecureRoute path="/profile" component={Profile} />
          <SecureRoute path="/apps" component={Applications} />
          <SecureRoute path="/balance" component={Api} />
          <SecureRoute path="/admin" component={Admin} />
        </Switch>
      </Container>
    </Security>
  );
};

export default App;
