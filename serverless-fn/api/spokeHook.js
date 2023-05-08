const fetch = require('node-fetch');
import { allowCors } from './helpers/cors';

const us_api_key = '00TNuJA9l-fSQjSj4_Gzgml7oUiacOwkmWnFvu-Ciu';

const eu_api_key = '00yTw_ZiHzbMC_yD0sKBJHs_0OR4F9SMoYW296hc85';

const spokes = {
  "us.spoke": {
    domain: 'udp-gotcorp-d0f.oktapreview.com',
    api_key: '00TNuJA9l-fSQjSj4_Gzgml7oUiacOwkmWnFvu-Ciu'
  },
  "eu.spoke": {
    domain: 'gameofthrones-ext.okta.com',
    api_key: '00yTw_ZiHzbMC_yD0sKBJHs_0OR4F9SMoYW296hc85'
  }
};
async function spokeHook(req, res) {
  let user = null;
  const user_spoke = req.body.data.context.user.profile.login.split("@");
  const uid = user_spoke[0];
  const spoke = user_spoke[1];
  const domain = spokes[spoke].domain;
  const api_key = spokes[spoke].api_key;

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

  const {firstName, lastName, login, email} = user.profile;

  let commands = {
    commands: [
      {
        type: 'com.okta.identity.patch',
        value: [
          {
            op: 'add',
            path: '/claims/firstName',
            value: `${firstName}`,
          },
          {
            op: 'add',
            path: '/claims/lastName',
            value: `${lastName}`,
          },
          {
            op: 'replace',
            path: '/claims/email',
            value: `${email}`,
          },
          {
            op: 'add',
            path: '/claims/login',
            value: `${login}`,
          },
        ],
      },
    ],
  };
  

  res.send(commands);
}

module.exports = allowCors(spokeHook);
