export const config = {
  runtime: "edge",
};

export default async (req) => {
  let commands = {
    commands: [
      {
        type: "com.okta.access.patch",
        value: [
          {
            op: "replace",
            path: "/token/lifetime/expiration",
            value: 80000,
          },
        ],
      },
      {
        type: "com.okta.access.patch",
        value: [
          {
            op: "add",
            path: "/claims/special_permissions",
            value: [
              "create:resource",
              "read:resource",
              "update:resource",
              "delete:resource",
            ],
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(commands), {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=86400",
      "Content-Type": "application/json",
    },
  });
};
