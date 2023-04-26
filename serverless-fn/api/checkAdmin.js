const fetch = require('node-fetch');
import { allowCors } from './helpers/cors';

async function checkAdmin(req, res) {
  let resp = {};
  let roles = {};
  let options = {};

  if (req.method === 'POST' && req.body && 'uid' in req.body) {
    const uid = req.body.uid;
    options = {
      method: 'GET',
      headers: {
        Authorization: `SSWS ${process.env.API_KEY}`,
      },
    };

    try {
      roles = await fetch(
        `https://okta.mark-vong.com/api/v1/users/${uid}/roles`,
        options
      );
      roles = await roles.json();
      //   console.log(roles);
      resp = roles.length > 0 ? { isAdmin: true } : { isAdmin: false };
    } catch (e) {
      console.log(e);
    }
  }
  res.send(resp);
}

module.exports = allowCors(checkAdmin);
