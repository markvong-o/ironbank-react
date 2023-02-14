const fetch = require('node-fetch');

export default async function checkAdmin(req, res) {
  const origin = req.headers.origin;

  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://ironbank.mark-vong.com',
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
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
