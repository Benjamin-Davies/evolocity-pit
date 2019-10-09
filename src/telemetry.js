/**
 * @param{Date} start
 * @param{Date} end
 */
export async function getTelemetryData(start, end) {
  const res = await fetch(
    `/api/sensors/${start.toISOString()}/${end.toISOString()}`);
  return await res.json();
}
