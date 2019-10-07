const express = require('express');
const proxy = require('express-http-proxy');

const api = require('./api');

const app = express();

app.use('/api', api());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
} else {
  app.use(proxy('localhost:3000'));
}

app.listen(process.env.PORT || 1234);
