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
  const [startTime, setStartTime] = useState(new Date(2019, 8, 22));
  const [endTime, setEndTime] = useState(new Date());

  const handleOptionChange = useCallback((ev: ChangeEvent) => {
    setDataSource((ev.target as HTMLInputElement).value as DataSource);
  }, []);

  useEffect(() => {
    setData([]);
    switch (dataSource) {
      case 'Live':
        const sub = getDataStream().subscribe(newData => {
          setData(d => [...d, newData]);
        });
        return () => sub.unsubscribe();
      case 'Range':
        getDataRange(startTime, endTime).then(setData);
        return;
    }
  }, [dataSource, startTime, endTime, setData]);

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
            value={startTime.toISOString().slice(0, -1)}
            onChange={ev => setStartTime(new Date(ev.target.value))}
          />
          <input
            type="datetime-local"
            value={endTime.toISOString().slice(0, -1)}
            onChange={ev => setEndTime(new Date(ev.target.value))}
          />
        </div>
      ) : null}
    </div>
  );
}

export default DataSelector;
