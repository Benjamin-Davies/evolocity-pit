import { QuerySnapshot } from '@google-cloud/firestore';
import { config, https } from 'firebase-functions';
import { credential, firestore, initializeApp } from 'firebase-admin';

import * as express from 'express';
import * as cors from 'cors';

const adminConfig = process.env.NODE_ENV === 'development'
  ? {
    credential: credential.cert(require('../adminsdk.keys.json')),
    databaseURL: "https://tau-morrow.firebaseio.com"
  }
  : config().firebase;
initializeApp(adminConfig);

const snapshotToArray = (snapshot: QuerySnapshot) =>
  snapshot.docs.map(doc => doc.data);

const app = express();
app.use(cors({ origin: true }));

app.get('/sensors/:start/:end', async (req, res) => {
  const startTime = new Date(req.params.start);
  const endTime = new Date(req.params.end);

  const db = firestore();
  const query = db.collection('sensors')
    .where('time', '>', startTime)
    .where('time', '<', endTime)
    .orderBy('time');
  const sensors = snapshotToArray(await query.get());

  res.send(sensors);
});

export const api = https.onRequest(app);
