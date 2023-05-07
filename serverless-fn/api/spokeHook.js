const fetch = require('node-fetch');
import { allowCors } from './helpers/cors';

const api_key = '00TNuJA9l-fSQjSj4_Gzgml7oUiacOwkmWnFvu-Ciu';

const spokes = {
  "us.spoke": {
    domain: 'udp-gotcorp-d0f.oktapreview.com',
  },
};
async function spokeHook(req, res) {
  let user = null;
  const user_spoke = req.body.data.context.user.profile.login.split("@");
  const uid = user_spoke[0];
  const spoke = user_spoke[1];
  const domain = spokes[spoke].domain;

  console.log(domain);

  let options = {
    method: 'GET',
    headers: {
        'Content-Type':'application/json',
      Authorization: `SSWS ${api_key}`,
    },
  };

  try {
    user = await fetch(
      `https://${domain}/api/v1/users/${uid}`,
      options
    );
    user = await user.json();
  } catch (e) {
    console.log(e);
  }

  let commands = {
    commands: [
      {
        type: 'com.okta.identity.patch',
        value: [
          {
            op: 'add',
            path: '/claims/firstName',
            value: `${user.firstName}`,
          },
          {
            op: 'add',
            path: '/claims/lastName',
            value: `${user.lastName}`,
          },
          {
            op: 'replace',
            path: '/claims/email',
            value: `${user.email}`,
          },
          {
            op: 'add',
            path: '/claims/login',
            value: `${user.login}`,
          },
        ],
      },
    ],
  };
  

  res.send(commands);
}

module.exports = allowCors(spokeHook);
