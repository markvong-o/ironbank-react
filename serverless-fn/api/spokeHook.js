const fetch = require('node-fetch');
import { allowCors } from './helpers/cors';

const api_key = '00TNuJA9l-fSQjSj4_Gzgml7oUiacOwkmWnFvu-Ciu';

const spokes = {
  us: {
    domain: 'udp-got-corp-d0f',
  },
};
async function spokeHook(req, res) {
  let results = null;
  const uid = req.body.data.context.user.id;

  let options = {
    method: 'GET',
    headers: {
      Authorization: `SSWS ${api_key}`,
    },
  };

  try {
    results = await fetch(
      `https://udp-gotcorp-d0f.okta.com/api/v1/users/${uid}`,
      options
    );
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
            value: 'placeholderFirstName',
          },
        ],
      },
    ],
  };
  console.log(results);

  res.send(commands);
}

module.exports = allowCors(spokeHook);
