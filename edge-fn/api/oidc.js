export const config = {
  runtime: 'edge',
};

export default async (req) => {
  let url = new URL(req.url);
  let search = new URLSearchParams(url.search);
  let code = search.get('code');
  let idpId = search.get('state');

  // get the idp config information
  let getIdpOptions = {
    method: 'GET',
    headers: {
      Authorization: `SSWS ${apikey}`,
    },
  };
  let idpUrl = `https://okta.mark-vong.com/api/v1/idps/${idpId}`;
  let idpRes = await fetch(idpUrl, getIdpOptions);

  return new Response({});
};
