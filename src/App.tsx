import React, { useState } from 'react';

import { Map, Marker, TileLayer } from 'react-leaflet';
import { VictoryLine, VictoryChart, VictoryTheme } from 'victory';

import { SensorData } from './telemetry';
import DataSelector from './DataSelector';
import Loading from './Loading'

import 'leaflet/dist/leaflet.css';
import './leaflet-webpack-patch';
import './App.css';

function App() {
  const [data, setData] = useState<SensorData[]>([]);
  const lastData = data[data.length - 1];

  const {
    battery_voltage,
    current,
    location,
  } = lastData || {};

  const [center, zoom]: [[number, number], number] =
    location
      ? [[location.latitude, location.longitude], 18]
      // Fallback to zoomed-out view of tauranga
      : [[-37.69, 176.17], 15];

  return (
    <div className="App">
      <div className="App-map">
        <Map center={center} zoom={zoom}>
          <TileLayer
            attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          {location ? <Marker position={center} /> : null}
        </Map>
      </div>
      <div className="App-status">
        <span className="left orange">&tau;-morrow</span>
        {lastData ? (
          <>
            <span className="right">{battery_voltage.toFixed(2)}V</span>
            <span className="right">{current.toFixed(2)}A</span>
          </>
        ) : (
          <span className="right">{2 * Math.PI}</span>
        )}
      </div>
      <div className="App-controls">
        <DataSelector setData={setData} />
        <div className="chart-container">
          {lastData ? (
            <VictoryChart
              theme={VictoryTheme.material}
              width={window.innerWidth * 0.4}
              height={window.innerWidth * 0.4}
            >
              <VictoryLine data={data} x="date" y="current" />
            </VictoryChart>
          ) : (
            <Loading what="data" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
