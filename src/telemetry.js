const start = new Date();

export async function getTelemetryData(since = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0)) {
  const res = await fetch(
    `https://php.mmc.school.nz/201BH/benjamindavies/evolocity/telemetry?since=${since}`);
  return await res.json();
}
