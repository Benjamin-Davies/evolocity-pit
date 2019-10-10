import * as functions from 'firebase-functions';

export const sensors = functions.https.onRequest((req, res) => {
  const params = req.url.split('/');
  const startTime = new Date(params[1]);
  const endTime = new Date(params[2]);
  res.send({ startTime, endTime });
});
