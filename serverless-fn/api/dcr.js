/**
 * Dynamic client reg
 */

const fetch = require("node-fetch");
import { allowCors } from "./helpers/cors";
import client from "./helpers/client";

async function dcr(req, res) {
  let resp = {};
  let roles = [];

  let app_create = "";
  if (
    req.method === "POST" &&
    req.body &&
    "uid" in req.body &&
    "client_name" in req.body
  ) {
    const { uid, client_name } = req.body;
    try {
      const application = {
        client_name,
        grant_types: ["client_credentials"],
        response_types: ["token"],
        token_endpoint_auth_method: "client_secret_basic",
        application_type: "service",
        profile: {
          uid,
        },
      };
      console.log("calling here");
      const url = `${client.baseUrl}/oauth2/v1/clients`;
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //   "Authorization": `SSWS 00CJA8DQMob60f4kiacVllfbZ9h4w4u9moNfAryaZL`
        },
        body: JSON.stringify(application),
      };
      console.log(url, request);
      app_create = await client.http.http(url, request);
      console.log(app_create);
    } catch (e) {
      console.log("error");
      console.log(e, e.status);
      res.send(e);
    }
  }
  console.log("skipping");
  res.send(app_create);
}

module.exports = allowCors(dcr);
