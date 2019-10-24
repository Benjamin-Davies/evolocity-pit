import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';

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

export function getDataStream(start: Date = new Date()): Observable<SensorData> {
  const query = sensors
    .where('time', '>', start);
  return new Observable(sub => {
    query.onSnapshot({
      complete() { sub.complete(); },
      error(err) { sub.error(err); },
      next(snap) {
        for (const change of snap.docChanges()) {
          if (change.type === 'added')
            sub.next(change.doc.data() as SensorData);
        }
      },
    });
  });
}
