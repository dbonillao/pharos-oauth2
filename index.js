'use strict';

const app = require('express')();
const port = 3000;
const http = require('http').Server(app);

module.exports = (cb) => {
  const callbackUrl = 'http://46.101.191.120:3000/callback';

 http.listen(3000, '46.101.191.120', (err) => {
     if (err) return console.error(err);

     console.log(`Express server listening at http://46.101.191.120:${port}`);
     cb({
         app,
         callbackUrl,
     });
 });

};
