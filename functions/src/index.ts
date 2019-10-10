import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';

const app = express();

app.use(cors({ origin: true }));

app.get('/sensors/:start/:end', (req, res) => {
  const startTime = new Date(req.params.start);
  const endTime = new Date(req.params.end);
  res.send({ startTime, endTime });
});

export const api = functions.https.onRequest(app);
