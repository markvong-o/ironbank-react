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
  const [clientName, setClientName] = useState("");
  const [createDisabled, setCreateDisabled] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {}, [authState, oktaAuth]); // Update if authState changes
  useEffect(() => {
    if (clientName.length > 0) {
      setCreateDisabled(false);
    }
  }, [clientName]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  /**
   * Refresh list of clients
   * Reset the button
   * Reset the input field
   */
  const resetScreen = () => {
    // Refresh clients
    setClientName("");
    setCreateDisabled(true);
  };

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
    let client_res = await fetch(url, options);
    if (client_res === 200) {
    }
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
          <button onClick={createClient} disabled={createDisabled}>
            Create Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default M2M;
