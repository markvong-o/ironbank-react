/**
 * Dynamic client reg
 */

const fetch = require("node-fetch");
import { allowCors } from "./helpers/cors";
import client from "./helpers/client";
const url = require("url");
import qs from "qs";

async function dcr(req, res) {
  let resp = {};
  let roles = [];
  let s = 404;
  let app_res = "";
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

      const url = `${client.baseUrl}/oauth2/v1/clients`;
      const request = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
      };
      let app_create = await client.http.http(url, request);
      if (app_create.status === 201) {
        app_res = await app_create.json();
      }
    } catch (e) {
      res.status(e.status).send(e);
    }
  } else if (req.method === "GET") {
    // Return only clients with application_type = service
    /**
     * There is a client id, retrieve the client secret, and grab an access token
     * DEMO...
     */
    let access_token = null;
    if (req.query && "client_id" in req.query) {
      const { client_id } = req.query;
      const r = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      // Grab the client secret
      const u = `https://okta.mvbuilt.com/api/v1/apps/${client_id}/credentials/secrets`;
      let c_r = await client.http.http(u, r);
      if (c_r.status === 200) {
        c_r = await c_r.json();
        if (c_r.length < 1) return;
        // Just get the first one
        let { client_secret } = c_r[0];
        // Now make the call to /token
        const token_url = `https://okta.mvbuilt.com/oauth2/ausqbble225O9UEc8696/v1/token`;
        const encoded_data = qs.stringify({
          grant_type: "client_credentials",
          scope: "read:balance",
        });
        const auth_string = `${client_id}:${client_secret}`;
        const buffer = Buffer.from(auth_string, "utf-8");
        const b64E = buffer.toString("base64");

        const req_c = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${b64E}`,
          },
          body: encoded_data,
        };

        let tmp_res = await fetch(token_url, req_c);
        // console.log(tmp_res);
        if (tmp_res.status === 200) {
          access_token = await tmp_res.json();
          app_res = access_token;
          s = tmp_res.status;
        } else {
          app_res = await tmp_res.json();
          s = tmp_res.status;
        }
      }
    } else {
      try {
        const url = `${client.baseUrl}/oauth2/v1/clients?limit=56`;
        const request = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        let app_get = await client.http.http(url, request);
        if (app_get.status === 200) {
          app_res = await app_get.json();
          app_res = app_res.filter((app) => app.application_type === "service");
          s = app_get.status;
        }
      } catch (e) {
        res.status(e.status).send(e);
      }
    }
  }
  res.status(s).send(app_res);
}

module.exports = allowCors(dcr);
