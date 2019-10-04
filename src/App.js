import React, { useState, useEffect } from 'react';
//import Chart from 'react-google-charts';

import { getTelemetryData } from './telemetry';

import './App.css';

function App() {
  const [data, setData] = useState([{
    date: new Date(),
    battery_voltage: 0,
    voltage: 0,
    current: 0,
    location: null,
  }]);
  const lastData = data[data.length - 1];

  useEffect(() => {
    getTelemetryData()
      .then(setData);
  }, []);

  useEffect(() => {
    if (data.length > 1) {
      const timeout = setTimeout(() => {
        getTelemetryData(lastData.time)
          .then(res => {
            setData([...data, ...res]);
          });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [data, lastData, setData]);

  console.log(lastData);
  return (
    <div className="App">
      <div className="App-status">
        <span className="left orange">&tau;-morrow</span>
        <span className="right">{lastData.battery_voltage}V</span>
        <span className="right">{lastData.current}A</span>
      </div>
      <header className="App-header">
        <h1>Welcome to &tau;-morrow pit</h1>
      </header>
      <main className="App-main">
    {/*<Chart
          width={0.4 * window.innerWidth}
          height={600}
          chartType="Line"
          loader={<div>Loading...</div>}
          data={
            [['Time', 'Voltage', 'Current', 'Speed', 'Battery']]
              .concat(data.map(
                ({time, voltage, current, speed, battery_voltage}) =>
                  [time, voltage, current, speed, battery_voltage]))}
          options={{
            chart: {
              title: 'Car Data',
            },
          }}
          />*/}
      </main>
    </div>
  );
}

export default App;
