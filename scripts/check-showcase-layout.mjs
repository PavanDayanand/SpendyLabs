// Synthetic layout constraints, not people, browser sessions, or preference research.
// Run: node scripts/check-showcase-layout.mjs
let seed = 42;
function random() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; }
let failed = 0;
for (let scenario = 0; scenario < 100_000; scenario++) {
  const viewport = 320 + Math.floor(random() * 2241);
  // Conservative 40px page gutters; actual mobile gutters are smaller.
  const available = Math.min(viewport, 1280) - 80;
  const columns = viewport <= 700 ? 1 : 2;
  const panel = (available - (columns - 1) * 20) / columns;
  const image = Math.min(220, panel - 48);
  const theme = random() < .5 ? 'light' : 'dark';
  const shortcutView = random() < .5 ? 'result' : 'actions';
  if (image <= 0 || image > panel || !['light', 'dark'].includes(theme) || !['result', 'actions'].includes(shortcutView)) failed++;
}
console.log(JSON.stringify({kind: 'synthetic layout model only', scenarios: 100_000, failures: failed, seed: 42, limitation: 'Does not execute a browser or measure user preferences. Text wrapping, accessibility and real rendering require separate browser checks.'}, null, 2));
if (failed) process.exitCode = 1;
