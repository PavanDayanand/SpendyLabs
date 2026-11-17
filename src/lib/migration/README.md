# Spendy PWA → iOS backups

`index.mjs` is the canonical, browser-only, dependency-free conversion engine.
The website uses it directly. The PWA vendors an identical copy so each app can
build and work offline independently. No backup contents are sent to a server.

After changing conversion rules:

```sh
node --test src/lib/migration/migration.test.mjs
node scripts/sync-migration.mjs '../SpendyPWA'
node scripts/sync-migration.mjs '../SpendyPWA' --check
```

Both UIs review counts, balances, SF Symbol substitutions, missing historical
subscription links and fields that can only be archived. Unsupported financial
values or broken references stop conversion. Yearly budgets require an explicit
choice to archive the original budget and leave the native budget disabled.
Ambiguous currency symbols require a currency selection; no FX conversion occurs.

IDs are deterministic and transaction subscription references use the same ID map.
The source object is not mutated. `_spendyMigration.originalBackup` preserves all
original JSON fields in the downloaded file, including unsupported fields. Native
iOS ignores that extension and **does not retain it in its subsequent exports**.
The UI instructs users to keep the migration file. Importing into iOS replaces
its current data; the export tool itself never writes to either app's ledger.

The synthetic fixture contains no personal records. Native import verification
must be repeated when the iOS StoragePayload or financial models change.
