const fetch = require('node-fetch');
import { allowCors } from './helpers/cors';
import client from './helpers/client';

async function checkAdmin(req, res) {
  let resp = {};
  let roles = [];

  if (req.method === 'POST' && req.body && 'uid' in req.body) {
    const uid = req.body.uid;

    try {
      let roles_collection = await client.roleAssignmentApi.listAssignedRolesForUser({userId:uid});
      await roles_collection.each((role) => {
        roles.push(role)
      })
      resp = roles.length > 0 ? { isAdmin: true } : { isAdmin: false };
      // console.log(resp, roles)
    } catch (e) {
      console.log(e);
    }
  }
  res.send(resp);
}

module.exports = allowCors(checkAdmin);
