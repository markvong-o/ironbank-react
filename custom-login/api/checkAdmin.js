import axios from 'axios';

const oktaMgmtAxios = axios.create({
  baseURL: 'https://okta.mark-vong.com/api/v1',
  timeout: 1000,
  headers: { Authorization: `SSWS ${process.env.OIE_API_KEY}` },
});

export default async function checkAdmin(req, res) {
  let resp = {};
  if (req.method === 'POST' && req.body && 'uid' in req.body) {
    const uid = req.body.uid;
    const roles = await oktaMgmtAxios.get(`/users/${uid}/roles`);
    resp = roles.data.length > 0 ? { isAdmin: true } : { isAdmin: false };
  }
  res.send(resp);
}
