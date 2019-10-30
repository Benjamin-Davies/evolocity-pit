import React, { useState, useEffect } from 'react';

import { Map, TileLayer } from 'react-leaflet';
import { VictoryLine, VictoryChart, VictoryTheme } from 'victory';

import { SensorData, getDataRange } from './telemetry';

import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [startTime, setStartTime] = useState(new Date(2019, 8, 22));
  const [endTime, setEndTime] = useState(new Date());

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

  useEffect(() => {
    getDataRange(startTime, endTime)
      .then(setData);
    //const sub = getDataStream()
    //  .subscribe(newData => {
    //   setData([...data, newData]);
    //  });
    //return () => sub.unsubscribe();
  }, [startTime, endTime]);

  console.log(data);
  return (
    <div className="App">
      <div className="App-status">
        <span className="left orange">&tau;-morrow</span>
        { lastData ? (
          <>
            <span className="right">{battery_voltage.toFixed(2)}V</span>
            <span className="right">{current.toFixed(2)}A</span>
          </>
          ) : (
            <span className="right">{2*Math.PI}</span>
          ) }
      </div>
      <header className="App-header">
        <h1>Welcome to &tau;-morrow pit</h1>
      </header>
      <main className="App-main">
        <input type="datetime-local"
          value={startTime.toISOString().slice(0, -1)}
          onChange={ev => setStartTime(new Date(ev.target.value))} />
        <input type="datetime-local"
          value={endTime.toISOString().slice(0, -1)}
          onChange={ev => setEndTime(new Date(ev.target.value))} />
        { lastData ? (<div className="App-row">
          <Map center={center} zoom={zoom}>
            <TileLayer
              attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </Map>
          <div className="chart-container">
            <VictoryChart
              theme={VictoryTheme.material}
              width={window.innerWidth*.4}
              height={window.innerWidth*.4}
            >
              <VictoryLine
                data={data}
                x="date"
                y="current"
                />
            </VictoryChart>
          </div>
        </div>) : null }
      </main>
    </div>
  );
}

export default App;
