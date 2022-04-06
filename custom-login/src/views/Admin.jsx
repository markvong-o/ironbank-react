/*eslint-disable*/

import AdminView from './AdminView';
import AdminCreate from './AdminCreate';
import AdminCreateGroups from './AdminCreateGroups';
import { Button } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';

const Admin = () => {
  let [view, setView] = useState(false);
  let [create, setCreate] = useState(false);
  let [createG, setCreateG] = useState(false);

  return (
    <div>
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
              'https://crownlands.game-of-thrones.us/home/admin-entry',
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
