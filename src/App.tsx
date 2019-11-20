import React, { useState, useCallback } from 'react';

import { Map, Marker, TileLayer } from 'react-leaflet';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryLegend } from 'victory';

import { SensorData } from './telemetry';
import DataSelector from './DataSelector';
import Loading from './Loading'

import 'leaflet/dist/leaflet.css';
import './leaflet-webpack-patch';
import './App.css';

function App() {
  const [data, setData] = useState<SensorData[]>([]);
  const lastData = data[data.length - 1];

  const [satelite, setSatelite] = useState(false);
  const sateliteChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setSatelite(ev.target.checked);
    },
    [setSatelite]
  );

  const {
    battery_voltage,
    speed,
    current,
    location,
  } = lastData || {};

  const [center, zoom]: [[number, number], number] =
    location
      ? [[location.latitude, location.longitude], 19]
      // Fallback to zoomed-out view of tauranga
      : [[-37.69, 176.17], 15];

  const chartData = ['battery_voltage', 'speed', 'current']
    .map(key => data.map(d => ({
      x: d.date,
      y: (d as any)[key] || 0,
    })));
  const colors = ['green', 'red', 'blue'];

  return (
    <div className="App">
      <div className="App-map">
        <Map center={center} zoom={zoom}>
          {satelite ? (
            <TileLayer
              attribution="&amp;copy <a href='https://esri.com/'>Esri</a> World Imagery"
              url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
          ) : (
            <TileLayer
              attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
          )}
          {location ? <Marker position={center} /> : null}
        </Map>
      </div>
      <div className="App-status">
        <span className="left orange">&tau;-morrow</span>
        {lastData ? (
          <>
            <span className="right">{battery_voltage.toFixed(2)} V</span>
            <span className="right">{speed.toFixed(2)} km/h</span>
            <span className="right">{current.toFixed(2)} A</span>
          </>
        ) : (
          <span className="right">{2 * Math.PI}</span>
        )}
      </div>
      <div className="App-controls">
        <div className="map-selector">
          <label>
            <input
              type="checkbox"
              checked={satelite}
              onChange={sateliteChange}
            />
            Satelite Images
          </label>
        </div>
        <DataSelector setData={setData} />
        <div className="chart-container">
          {lastData ? (
            <VictoryChart
              theme={VictoryTheme.material}
              width={window.innerWidth * 0.4}
              height={window.innerWidth * 0.4}
            >
              {
                chartData.map((d, i) => (
                  <VictoryLine
                    key={i}
                    data={d}
                    style={{
                      data: { stroke: colors[i]},
                    }}
                    />
                ))
              }
              <VictoryLegend x={125} y={10}
                orientation="horizontal"
                gutter={20}
                colorScale={colors}
                data={[
                  { name: "Battery Voltage" }, { name: "Speed" }, { name: "Current" }
                ]}
                />
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
