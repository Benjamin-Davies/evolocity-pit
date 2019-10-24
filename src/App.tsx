import React, { useState, useEffect } from 'react';

import { getDataRange } from './telemetry';

import './App.css';

function App() {
  const [startTime, setStartTime] = useState(new Date(2019, 8, 22));
  const [endTime, setEndTime] = useState(new Date());

  const [data, setData] = useState<any[]>([]);
  const lastData = data[data.length - 1];

  useEffect(() => {
    getDataRange(startTime, endTime)
      .then(setData);
  }, [ startTime, endTime ]);

  console.log(lastData);
  return (
    <div className="App">
      <div className="App-status">
        <span className="left orange">&tau;-morrow</span>
        { lastData ? (
          <>
            <span className="right">{lastData.battery_voltage.toFixed(2)}V</span>
            <span className="right">{lastData.current.toFixed(2)}A</span>
          </>
        ) : null }
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
      </main>
    </div>
  );
}

export default App;
