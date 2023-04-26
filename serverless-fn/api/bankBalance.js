const OktaJwtVerifier = require('@okta/jwt-verifier');
import { allowCors } from './helpers/cors';

const jwtVerifier = new OktaJwtVerifier({
  issuer: 'https://okta.mark-vong.com/oauth2/ausqbble225O9UEc8696',
  assertClaims: {
    'scp.includes': ['read:balance'],
  },
});

async function bankBalance(req, res) {
  const authHeader = req.headers.authorization || null;
  const match = authHeader ? authHeader.match(/Bearer (.+)/) : null;
  const expectedAudience = 'api://iron-bank';
  if (!match) {
    return res.status(401).send('Not authorized');
  }

  const accessToken = match[1];

  let balance = { balance: 50, institution: 'Iron Bank' };

  let validToken = null;

  try {
    validToken = await jwtVerifier.verifyAccessToken(
      accessToken,
      expectedAudience
    );
  } catch (e) {
    if (e) {
      return res.status(401).send('Not authorized');
    }
  }
  if (validToken) {
    const data = {
      balance,
      user_token: validToken.claims,
    };
    return res.status(200).send(data);
  }
  res.send({});
}

module.exports = allowCors(bankBalance);
