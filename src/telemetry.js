export async function getTelemetryData() {
  const res = await fetch('https://php.mmc.school.nz/201BH/benjamindavies/evolocity/telemetry');
  return await res.json();
}
