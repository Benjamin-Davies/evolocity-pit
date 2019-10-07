const { Database } = require('sqlite3');

const db = new Database('sensors.sqlite');

/**
 * @param {Date} start
 * @param {Date} end
 * @returns {Promise<object[]>}
 */
function getRange(start, end) {
  console.log(arguments);
  return new Promise((res, rej) => {
    db.all(
      'SELECT * FROM readings WHERE time > ? AND time < ?',
      [start.toISOString(), end.toISOString()],
      (err, rows) => {
        if (err)
          return rej(err);

        res(rows);
      }
    );
  });
}

module.exports = { getRange };
