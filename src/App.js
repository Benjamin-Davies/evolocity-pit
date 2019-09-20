import React, { useState, useEffect } from 'react';
import { getTelemetryData } from './telemetry';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTelemetryData()
      .then(setData);
  }, []);

  return (
    <div className="App">
      <header className="App-status">
        <span className="left orange">&tau;-morrow</span>
      </header>
      <main className="App-main">
        <h1>Welcome to &tau;-morrow pit</h1>
        <ul>
          { data.map(d => (<li key={d.time}>{new Date(d.time).toString()} - {d.battery_voltage}</li>)) }
        </ul>
      </main>
    </div>
  );
}

export default App;
