// Explicit maintenance command, not a build-time dependency on another checkout.
// node scripts/sync-migration.mjs /path/to/SpendyPWA [--check]
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const target = process.argv[2];
if (!target) throw new Error('Pass the SpendyPWA checkout path.');
const source = fileURLToPath(new URL('../src/lib/migration/index.mjs', import.meta.url));
const destination = resolve(target, 'src/utils/spendy-migration.mjs');
const code = await readFile(source, 'utf8');
if (process.argv.includes('--check')) {
  if (code !== await readFile(destination, 'utf8')) throw new Error('Migration engines differ. Run sync-migration.mjs without --check.');
  console.log('VERDICT: PASS — both sites use the same migration engine.');
} else {
  await writeFile(destination, code);
  console.log('Synced the migration engine to the PWA.');
}
