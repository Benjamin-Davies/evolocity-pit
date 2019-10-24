import firebase from 'firebase/app';
import 'firebase/firestore';

import firebaseConfig from './firebase-config';

export const app = firebase.initializeApp(firebaseConfig);
export const db = app.firestore();

export const sensors = db.collection('sensors');

export async function getTelemetryData(start: Date, end: Date) {
  const query = sensors
    .where('time', '>', start)
    .where('time', '<', end);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => doc.data());
}
