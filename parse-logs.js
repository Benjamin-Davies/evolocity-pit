const fs = require('fs');
const { Database } = require('sqlite3');
const { promisify } = require('util');
const ProgressBar = require('progress');

const readFile = promisify(fs.readFile);
Database.prototype.runAsync = promisify(Database.prototype.run);

const readJsonLines = function*(str) {
  const lines = str.split('\n');
  for (const line of lines) {
    try {
      yield JSON.parse(line);
    } catch (e) {
      console.warn('Ignoring corrupt line');
    }
  }
}

const batches = function*(size, iter) {
  let arr = [];
  for (const x of iter) {
    arr.push(x);
    if (arr.length >= size) {
      yield arr;
      arr = [];
    }
  }
};

const dropTableQuery = `
DROP TABLE readings;
`;
const createTableQuery = `
CREATE TABLE readings(
  time CHAR(24) NOT NULL,
  current REAL NOT NULL,
  voltage REAL NOT NULL,
  battery_voltage REAL NOT NULL,
  location CHAR(100)
);
`;
const insertQuery = `
INSERT INTO readings
  VALUES ($time, $current, $voltage, $battery_voltage, $location);
`;

async function run() {
  const db = new Database('sensors.sqlite');

  try {
    await db.runAsync(dropTableQuery);
  } catch (_) { }

  await db.runAsync(createTableQuery);

  const str = await readFile('sensors.log', { encoding: 'utf-8' });
  const progress = new ProgressBar(':bar :current/:total :etas', { total: 35492 });

  for (const batch of batches(50, readJsonLines(str))) {
    await Promise.all(
      batch.map(v => db.runAsync(
        insertQuery, 
        {
          $time: v.time,
          $current: v.current,
          $voltage: v.voltage,
          $battery_voltage: v.battery_voltage,
          $location: v.location
        }).then(() => progress.tick())
      )
    );
  }

  db.close();
}

run().catch(console.error);
