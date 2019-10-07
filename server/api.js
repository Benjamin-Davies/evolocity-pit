const express = require('express');
const model = require('./models/sqlite');

module.exports = () => {
  const api = express();

  api.get('/sensors/:start/:end', async (req, res) => {
    const start = new Date(req.params.start);
    const end = new Date(req.params.end);

    const data = await model.getRange(start, end);

    res.send(data);
  });

  return api;
};
