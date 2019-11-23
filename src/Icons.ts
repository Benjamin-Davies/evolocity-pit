import * as L from 'leaflet';

import iconUrl from './blue-circle.png';

export const blueCircle = new L.Icon({
  iconUrl,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});
