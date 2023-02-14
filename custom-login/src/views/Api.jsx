/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Header, Icon, Table } from 'semantic-ui-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useOktaAuth } from '@okta/okta-react';

import '../css/Api.css';

import config from "../config";

const Api = () => {
  const BASENAME = process.env.PUBLIC_URL || '';
  const { authState, oktaAuth } = useOktaAuth();
  const [scopes, setScopes] = useState('openid profile email');
  const [accessToken, setAccessToken] = useState(null);
  const [claims, setClaims] = useState(null);
  const [response, setResponse] = useState(null);
  const [api, setApi] = useState(`${process.env.REACT_APP_API_URL}/api/bankBalance`);
  const [error, setError] = useState(null);

  const ISSUER =
    `${process.env.REACT_APP_ISSUER.split("/oauth2")[0]}/oauth2/ausqbble225O9UEc8696`;

    const {clientId, redirectUri} = config.oidc;

  const localOktaAuth = new OktaAuth({
    issuer: ISSUER,
    scopes: scopes.split(' '),
    clientId,
    redirectUri,
  });

  useEffect(() => {
    
  }, [authState, oktaAuth]); // Update if authState changes

  if (error) {
    return <div className="error">{error}</div>;
  }

  const callApi = async () => {
    if (api && accessToken) {
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      let res = null;
      let resJson = null;
      try {
        res = await fetch(api, options);
        if (res.status === 200) {
          resJson = await res.json();
        } else {
          setResponse({ status: res.status, error: 'Unauthorized access.' });
        }
      } catch (err) {
        console.log(err);
      }
      if (resJson) {
        setResponse(resJson);
      }
    }
  };

  const getAccessToken = async () => {
    let res = null;
    try {
      res = await localOktaAuth.token.getWithoutPrompt();
    } catch (err) {
      setError(err.errorSummary);
    }
    if (res) {
      setClaims(res.tokens.accessToken.claims);
      setAccessToken(res.tokens.accessToken.accessToken);
    }
  };
  const getToken = document.getElementById('get-token-container');

  const clearData = () => {
    setResponse(null);
    setAccessToken(null);
    setClaims(null);
  };

  return (
    <div id="main-api-container">
      <div id="internal-container">
        <Header as="h1">
          <Icon name="dollar sign" color="green" /> My Balance{' '}
        </Header>
        {!accessToken && (
          <div id="get-token-container">
            <span className="method">
              Separate scopes by a single whitespace
            </span>
            <input
              value={scopes}
              onChange={(e) => {
                setScopes(e.target.value);
                if (getToken) {
                  getToken.style.width = e.target.value.length + 'ch';
                }
              }}
            />
            <button onClick={getAccessToken}>Get Access Token</button>
          </div>
        )}

        {accessToken && (
          <div id="main-token-container">
            <Header as="h2"><Icon name="openid" color="yellow" />Access Token</Header>
            <button onClick={clearData}>Get a new Access Token</button>
            <div id="inner-token-container">
              <div id="raw-token-container" className="data-container">
                <textarea value={accessToken} readOnly />
                <button
                  onClick={() => navigator.clipboard.writeText(accessToken)}
                >
                  Copy Access Token
                </button>
              </div>

              {claims && (
                <div id="claims-container" className="data-container">
                  <pre>{JSON.stringify(claims, undefined, 2)}</pre>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(claims))
                    }
                  >
                    Copy Data
                  </button>
                </div>
              )}
            </div>

            <div id="api-container">
              <Header as="h2">Get your balance with the above Access Token:</Header>
              {!response ? (
                <div id="call-api-container">
                  <span className="method">GET:</span>
                  <input value={api} onChange={(e) => setApi(e.target.value)} />
                  <button onClick={callApi}>Submit</button>
                </div>
              ) : (
                <div id="results-container">
                  <pre id="results" readOnly>
                    {JSON.stringify(response, undefined, 2)}
                  </pre>
                  <button onClick={() => setResponse(null)}>
                    Call another API
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Api;
