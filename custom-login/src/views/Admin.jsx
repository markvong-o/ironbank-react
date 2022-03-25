/*eslint-disable*/

import AdminView from './AdminView';
import AdminCreate from './AdminCreate';
import AdminCreateGroups from './AdminCreateGroups';
import Impersonate from './Impersonate';
import { Button } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';

const Admin = () => {
  let [view, setView] = useState(false);
  let [create, setCreate] = useState(false);
  let [createG, setCreateG] = useState(false);
  let [impersonate, setImpersonate] = useState(false);

  return (
    <div>
      <Button.Group className="user-btn-grp" style={{ marginBottom: '3rem' }}>
        <Button
          onClick={() => {
            setView(true);
            setCreate(false);
            setCreateG(false);
            setImpersonate(false);
          }}
          basic
          color="black"
          style={{margin:"1rem"}}
        >
          View Users
        </Button>
        <Button
          onClick={() => {
            setView(false);
            setCreate(true);
            setCreateG(false);
            setImpersonate(false);
          }}
          basic
          color="black"
          style={{margin:"1rem"}}
        >
          Create Users
        </Button>
        <Button
          onClick={() => {
            setView(false);
            setCreate(false);
            setCreateG(true);
            setImpersonate(false);
          }}
          basic
          color="black"
          style={{margin:"1rem"}}
        >
          Create Groups
        </Button>
        <Button
          onClick={() => {
            setView(false);
            setCreate(false);
            setCreateG(false);
            setImpersonate(true);
          }}
          basic
          color="black"
          style={{margin:"1rem"}}
        >
          Impersonate User
        </Button>
        <Button
          onClick={() => {
            window.open(
              'https://thecrownlands.game-of-thrones.us/home/admin-entry',
              '_blank'
            );
          }}
          basic
          color="blue"
          style={{margin:"1rem"}}
        >
          Okta Admin Console
        </Button>
      </Button.Group>
      {view && <AdminView />}
      {create && <AdminCreate />}
      {createG && <AdminCreateGroups />}
      {impersonate && <Impersonate />}
    </div>
  );
};

export default Admin;
