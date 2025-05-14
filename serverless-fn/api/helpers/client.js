const okta = require("@okta/okta-sdk-nodejs");

const client = new okta.Client({
  orgUrl: "https://thecrownlands.okta.com",
  authorizationMode: "PrivateKey",
  clientId: "0oardzqpkt4iG5Zqm697",
  scopes: [
    "okta.users.manage",
    "okta.roles.manage",
    "okta.roles.read",
    "okta.clients.register",
    "okta.clients.manage",
    "okta.clients.read",
    "okta.apps.manage"
  ],
  privateKey:
    "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC04v1CAWIas37n\n" +
    "f8XhLQPVl0mTjBh1P4KxQovIYsyGv3EL/s6g1lRwRgQDGLC1xvOSckM8X33W0bao\n" +
    "5hkHV1wiR70fg2W+66krDnNauBj/Sj+U3y8OJaumKt0j0TEyZ31gfZBqolfIIu03\n" +
    "i8gemPzpi42ecmtNO63tamTmjz4PxWSlHI0RhCVrb/RjYIes5lqKkqqVsmE6SkEI\n" +
    "zc73iGu/Nj9ohr+TEcIWI4Rh9CyoZIQGf3xZeikZYSni3RC7wZPlUGzE6uU1dP/C\n" +
    "lWjaoT7dJWAkHBgbKxX3DecVndOEvO3xX6FKO6pJV95h+Puld2iqAY1GxseEdilV\n" +
    "BnOrv5n7AgMBAAECggEADnwApfOWEfzz5ACwwouyu2c+Y9tmLU6qc0buCjE9yb/J\n" +
    "rcQNHVxG7aia806GU+qm9WqYj1yMJz1Vaufl8tcK0HnodH4L5y0Ct6kUEUcdmqUC\n" +
    "O18LFbnBfsWpkzp8ky8t9Hc0LxMUhA5RQCSSypRwksOd0aVoNIqGA7VZzWEvVIl/\n" +
    "l9pTQC2wBzr0ahRX9LXfh3t1mIGPqBIHZ4EYA5pDf/0FXaTztMfVzki4y/RmrxMl\n" +
    "uXqvbbYuvEoYzhYf2UnJTF6uveuVwvquO8cgrKojWVVbG1y5na46df3gv6cSwx/K\n" +
    "hkpRQ+jC7iymMT+sICDn2M74JvvAYL/alEcDwJEJhQKBgQDan2UBWlMyfUw7mUtC\n" +
    "F9lhhF2WjqxK5sEZjdoKaSKI4FqVW28vX7r2Mqz+WODFoLeW5DuI92oDtr2K+WY2\n" +
    "DXfk0LT1eyKIUh79V9sfhKTSrkAt9qA/Hr9fetd92K36Nso5EiYRvi5nU9giM4lm\n" +
    "HyFo4QNxY2jH7Ka32WGFkDB+HQKBgQDTz/q61r+BHhv/w/0wIbrq9Sqs/DX9ymiV\n" +
    "1wMb3dN0K/s/5shbTzleV7ekxpnB+BC6VmKjnPpsogHOXjHrlHWTTLUi2YDELkzv\n" +
    "CUSYEGAEwi7DIYhBbMHSjoFrAksXd7HcHPdaSESSa3+zcCj2Qtgu8FP5sbpfu/Z4\n" +
    "GlHLwtnc9wKBgQCv5ZkFup+/urIwLYkwlzGuVSpbbVVQOlLY9Zmd0LMZf7FCBDvz\n" +
    "2Mj7NxCa3/WQ7FtqCx2feLkSXeAoxbqn+LQjJIzECZtiJPiMCzjhJf7bB5nZoVmT\n" +
    "D3EYKCTjOwfXjmer/V8l3WdGeV4nPmHpCVj/IjN78mimmlAVEdB1/uoVPQKBgQDL\n" +
    "hpP5BjJ7oe/rgmp93ltaO3vnPm2u0NhP6ouNMkhl34EL9PjebDDGy2ilx0OlU3TX\n" +
    "Z/xeFI+45K7xmidDo6KaiGGg+/g0Cf1YzsH/j/SDfgcq7sSbgSJ47P/EUC7RfO0F\n" +
    "gTvYn4psWykYxZRGlRJfgARg8HsSVG1PGJMyRKfNHwKBgG4PI5o7XLGPTmEKfTvG\n" +
    "PqWrtkQla4u0IoUTM23RxtLp0FSJJn9kcDuj2Hq1rTmKl7wJrozKcCq3RQy6UIPf\n" +
    "UJcIqqozsXI4cN7K1CIvBRYtd+Qe3lUr6wLgUwzP0ZY4atateDPzX9ASg9zmMHZW\n" +
    "ZYDxTwWEZREkFfFB/EndJA3h\n" +
    "-----END PRIVATE KEY-----",
  keyId: "P60XhFGo-ec0zY2RzuBZYXl8Ap-uj340uwGaN7FdV8s",
});

// const client = new okta.Client({
//   orgUrl: "https://thecrownlands.okta.com",
//   token: '00CJA8DQMob60f4kiacVllfbZ9h4w4u9moNfAryaZL'
// });

export default client;
