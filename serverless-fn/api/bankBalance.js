const OktaJwtVerifier = require('@okta/jwt-verifier');

const jwtVerifier = new OktaJwtVerifier({
  issuer: 'https://okta.mark-vong.com/oauth2/ausqbble225O9UEc8696',
  assertClaims: {
    'scp.includes': ['read:balance'],
  },
});

export default async function bankBalance(req, res) {
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
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  //   res.setHeader('Access-Control-Allow-Credentials', true);
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
