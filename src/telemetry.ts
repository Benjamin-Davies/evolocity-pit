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
  date: Date;
  location: firebase.firestore.GeoPoint | null;
  speed: number;
  economy: number;
  time: firebase.firestore.Timestamp;
  voltage: number;
}

/**WARNING! mutates argument */
function prepareSensorData(doc: firebase.firestore.QueryDocumentSnapshot): SensorData {
  const data = doc.data() as SensorData;
  data.date = data.time.toDate();
  return data;
}

export async function getDataRange(start: Date, end: Date): Promise<SensorData[]> {
  const query = sensors
    .where('time', '>', start)
    .where('time', '<', end);
  const snapshot = await query.get();
  return snapshot.docs.map(prepareSensorData);
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
            sub.next(prepareSensorData(change.doc));
        }
      },
    });
  });
}
