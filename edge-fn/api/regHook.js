export const config = {
  runtime: 'edge',
};

export default async (req) => {
  let body = await req.json();
  const allow = {
    commands: [
      {
        type: 'com.okta.action.update',
        value: {
          registration: 'ALLOW',
        },
      },
      // {
      //   type: 'com.okta.user.profile.update',
      //   value: {
      //     address: '',
      //   },
      // },
    ],
  };

  const deny = {
    commands: [
      {
        type: 'com.okta.action.update',
        value: {
          registration: 'DENY',
        },
      },
    ],
    error: {
      errorSummary: 'Invalid email. Please contact your admin.',
      errorCauses: [
        {
          errorSummary: 'Only Okta employees can register.',
          reason: 'INVALID_EMAIL_DOMAIN',
          locationType: 'body',
          location: 'data.userProfile.login',
          domain: 'end-user',
        },
      ],
    },
  };

  let resp =
    body.data.userProfile.email.includes('@okta.com') ||
    body.data.userProfile.email.includes('@atko.email')
      ? allow
      : deny;

  return new Response(JSON.stringify(resp), {
    status: 200,
    headers: {
      'Cache-Control': 's-maxage=86400',
      'Content-Type': 'application/json',
    },
  });
};
