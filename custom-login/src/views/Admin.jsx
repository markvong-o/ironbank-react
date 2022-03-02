/*eslint-disable*/

import AdminView from './AdminView';
import AdminCreate from './AdminCreate';
import { Button } from 'semantic-ui-react';
import React, { useEffect, useState } from 'react';

// import '../css/AdminView.css';

const Admin = () => {
  let [view, setView] = useState(false);
  let [create, setCreate] = useState(false);

  return (
    <div>
      <Button.Group className="user-btn-grp" style={{marginBottom:"3rem"}}>
        <Button
          onClick={() => {
            setView(true);
            setCreate(false);
          }}
          basic color="black"
          
        >
          View
        </Button>
        <Button
          onClick={() => {
            setView(false);
            setCreate(true);
          }}
          basic color="black"
        >
          Create
        </Button>
      </Button.Group>
      {view && <AdminView />}
      {create && <AdminCreate />}
    </div>
  );
};

export default Admin;
