const baseUrl = process.env.NODE_ENV === 'production'
  ? ''
  : 'http://localhost:5000/tau-morrow/us-central1';

/**
 * @param{Date} start
 * @param{Date} end
 */
export async function getTelemetryData(start, end) {
  const res = await fetch(
    `${baseUrl}/api/sensors/${start.toISOString()}/${end.toISOString()}`);
  return await res.json();
}
