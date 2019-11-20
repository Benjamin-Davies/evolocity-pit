import React, {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  Dispatch,
  SetStateAction
} from 'react';

import { SensorData, getDataRange, getDataStream } from './telemetry';

import './DataSelector.css';

export interface DataSelectorProps {
  setData: Dispatch<SetStateAction<SensorData[]>>;
}

type DataSource = 'Live' | 'Range';

function DataSelector({ setData }: DataSelectorProps) {
  const [dataSource, setDataSource] = useState<DataSource>('Live');

  const now = new Date();
  now.setUTCHours(now.getHours()); // So that it is in local time
  const nowStr = now.toISOString().slice(0, -1);
  const [startTime, setStartTime] = useState<string>(nowStr);
  const [endTime, setEndTime] = useState<string>(nowStr);

  const handleOptionChange = useCallback((ev: ChangeEvent) => {
    setDataSource((ev.target as HTMLInputElement).value as DataSource);
  }, []);

  useEffect(() => {
    setData([]);
    if (dataSource === 'Live') {
      const sub = getDataStream().subscribe(newData => {
        setData(d => [...d, newData]);
      });
      return () => sub.unsubscribe();
    }
  }, [dataSource, startTime, endTime, setData]);
  const fetchRange = useCallback(() => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    getDataRange(start, end).then(setData);
  }, [startTime, endTime, setData]);

  return (
    <div className="DataSelector">
      <div>
        <p>Data Source</p>
        <label>
          <input
            type="radio"
            value="Live"
            checked={dataSource === 'Live'}
            onChange={handleOptionChange}
          />
          Live
        </label>
        <label>
          <input
            type="radio"
            value="Range"
            checked={dataSource === 'Range'}
            onChange={handleOptionChange}
          />
          Range
        </label>
      </div>
      {dataSource === 'Range' ? (
        <div>
          <input
            type="datetime-local"
            value={startTime.toString()}
            onChange={ev => setStartTime(ev.target.value)}
          />
          <br />
          <input
            type="datetime-local"
            value={endTime.toString()}
            onChange={ev => setEndTime(ev.target.value)}
          />
          <br />
          <button onClick={fetchRange}>Fetch Range</button>
        </div>
      ) : null}
    </div>
  );
}

export default DataSelector;
