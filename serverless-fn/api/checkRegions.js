const fetch = require('node-fetch');
import { allowCors } from './helpers/cors';

const api_key = '00TNuJA9l-fSQjSj4_Gzgml7oUiacOwkmWnFvu-Ciu';

const spokes = {
  'us.spoke': {
    domain: 'udp-gotcorp-d0f.oktapreview.com',
  },
};

async function checkRegions(req, res) {
  let results = [];
  let user = null;
  if (req.query) {
    let { username } = req.query;
    const options = {
        method: "GET",
        headers: {
            "Accept":"application/json",
            "Content-Type": "application/json",
            Authorization: `SSWS ${api_key}`
        }
    }
    try {
      user = await fetch(
        `https://udp-gotcorp-d0f.oktapreview.com/api/v1/users/${username}`,
        options
      );
      user = await user.json();
    } catch (e) {
      console.log(e);
    }

    if (user) {
      results.push('US');
    }
  }

  res.send(results);
}

module.exports = allowCors(checkRegions);
