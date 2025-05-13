/*eslint-disable*/
import React, { useEffect, useState } from "react";
import { Header, Icon, Table } from "semantic-ui-react";
import { OktaAuth } from "@okta/okta-auth-js";
import { useOktaAuth } from "@okta/okta-react";

import "../css/Api.css";

import config from "../config";

const M2M = () => {
  const BASENAME = process.env.PUBLIC_URL || "";
  const { authState, oktaAuth } = useOktaAuth();
  const [scopes, setScopes] = useState("openid profile email");
  const [clientName, setClientName] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [claims, setClaims] = useState(null);
  const [response, setResponse] = useState(null);
  const [api, setApi] = useState(
    `${process.env.REACT_APP_API_URL}/api/bankBalance`
  );
  const [error, setError] = useState(null);

  useEffect(() => {}, [authState, oktaAuth]); // Update if authState changes

  if (error) {
    return <div className="error">{error}</div>;
  }

  const createClient = async () => {
    let url = `${process.env.REACT_APP_API_URL}/api/dcr`;
    let user = await oktaAuth.getUser();
    let data = {
      uid: user.sub,
      client_name: clientName,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    };
    await fetch(url, options);
  };

  return (
    <div id="main-api-container">
      <div id="internal-container">
        <Header as="h1">
          <span>OAuth Client Applications </span>
        </Header>

        <div id="get-token-container">
          <span className="method">Provide a client name</span>
          <input
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
            }}
          />
          <button onClick={createClient}>Create Client</button>
        </div>
      </div>
    </div>
  );
};

export default M2M;
