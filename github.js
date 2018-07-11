'use strict';

const createApplication = require('./');
const simpleOauthModule = require('simple-oauth2');

createApplication(({ app, callbackUrl }) => {

  const oauth2 = simpleOauthModule.create({
    client: {
      id: '92303fd8861b6d3548a7',
      secret: '27854cf0d2cfa6dac5deceb1061e6a47f5c51532',
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    },
  });

  // Authorization uri definition
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: 'http://46.101.191.120:3000/callback',
        scope: ['repo','delete_repo']
    });

  // Initial page redirecting to Github
  app.get('/auth', (req, res) => {
      res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/callback', async (req, res) => {
    console.log('callback');
    const code = req.query.code;
    const options = {
      code,
    };

    try {
      const result = await oauth2.authorizationCode.getToken(options);
      res.redirect('http://pharos.oculavis.de/login-github?access_token=' + result.access_token);
      const token = oauth2.accessToken.create(result);
      // Sending to frontend
      return res.status(200).json(token)
    } catch(error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  app.get('/', (req, res) => {
    res.send('Hello<br><a href="/auth">Log in with Github</a>');
  });
});
