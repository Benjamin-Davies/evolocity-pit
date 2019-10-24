import firebase from 'firebase/app';
import 'firebase/firestore';

import firebaseConfig from './firebase-config';

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

const sensors = db.collection('sensors');

export interface SensorData {
  battery_voltage: number;
  current: number;
  location?: string;
  time: firebase.firestore.Timestamp;
  voltage: number;
}

export async function getDataRange(start: Date, end: Date): Promise<SensorData[]> {
  const query = sensors
    .where('time', '>', start)
    .where('time', '<', end);
  const snapshot = await query.get();
  return snapshot.docs.map(doc => doc.data() as SensorData);
}
