/*eslint-disable*/
import { useOktaAuth } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import { useState } from 'react';
const VerifyEmail = () => {
  const oktaAuth = new OktaAuth({
    issuer: 'https://crownlands.game-of-thrones.us',
    clientId: '0oa2gbj0tnu7xAPdP697',
    redirectUri: 'http://localhost:8080/login/callback',
  });

  const [email, setEmail] = useState('');

  const AuthenticatorKey = {
    OKTA_PASSWORD: 'okta_password',
    OKTA_EMAIL: 'okta_password',
    PHONE_NUMBER: 'phone_number',
    SKIP: 'skip',
  };
  const signUp = async () => {
    const transac = await oktaAuth.idx.register({
      authenticators: [AuthenticatorKey.OKTA_PASSWORD],
      email,
    });
    console.log('initial', transac);

    const pwTransac = await oktaAuth.idx.proceed({ password: '0ktaDem0' });
    console.log('pw', pwTransac);

    const final = await oktaAuth.idx.proceed({ skip: true });
    console.log('final', final);

    console.log(
      'Session exists after registration',
      await oktaAuth.session.exists()
    );
  };

  const signIn = async () => {
    const sitekey = 'b1de2bb1-8e3b-4a3b-98ec-08e6a5dc4783';
    const captchaId = 'cap28n1p2fKFSOfgT697';
    const username = 'ao123@atko.email';
    const password = '0ktaDem0';
    const widgetId = hcaptcha.render('captcha', { sitekey });
    let transac;
    let resp;
    try {
      resp = await hcaptcha.execute(widgetId, { async: true });
      let captchaToken = res.response;
      transac = await oktaAuth.idx.authenticate({
        username,
        password,
        captchaVerify: {
          captchaId,
          captchaToken,
        },
      });
    } catch (e) {
      console.log(e);
    }
    console.log(resp, transac);

    console.log(
      'Session exists after idx login',
      await oktaAuth.session.exists()
    );
  };

  const pwSignIn = async () => {
    // Start authentication flow
    let a = await oktaAuth.idx.authenticate();
    console.log(a);
    // Grab username from input and proceed, this will trigger the email magic link sent for a pwless user
    let username = ""
    let b = await oktaAuth.idx.proceed({username})
    console.log(b)
    // Grab verification code from email or this if using magic link, handle per documentation: 
    // https://developer.okta.com/docs/guides/email-magic-links-overview/nodeexpress/main/#point-your-app-s-magic-links-to-that-endpoint
    let verificationCode = ''
    let c = await oktaAuth.idx.proceed({verificationCode})
    console.log(c)
    // Success - tokens returned
  };

  return (
    <div>
      <input
        id="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      ></input>
      <button onClick={signUp} style={{ color: 'white' }}>
        SignUp
      </button>
      <div id="captcha"></div>
      <button onClick={signIn} style={{ color: 'white' }}>
        SignIn
      </button>
      <button onClick={pwSignIn} style={{ color: 'white' }}>
        Pwless
      </button>
    </div>
  );
};

export default VerifyEmail;
