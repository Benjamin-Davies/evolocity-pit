const express = require('express');
const { createProxyServer } = require('http-proxy');

const api = require('./api');

const production = process.env.NODE_ENV === 'production';
const app = express();
/**@type{Server} */
let devProxy;

app.use('/api', api());

if (production) {
  app.use(express.static('build'));
} else {
  devProxy = createProxyServer({
    target: {
      host: 'localhost',
      port: 3000
    }
  });

  app.use((req, res) => {
    devProxy.web(req, res);
  });
}

const port = process.env.PORT || 1234;
const server = app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

if (!production) {
  server.on('upgrade', (req, socket, head) => {
    devProxy.ws(req, socket, head);
  });
}
