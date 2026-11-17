import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertPWAToIOS, createPWABackup, parsePWABackup, ConversionError } from './index.mjs';
import { migrationFixture } from './fixture.mjs';

test('preserves the ledger, exact instants, preferences and source without mutation', async () => {
  const source = migrationFixture();
  const original = structuredClone(source);
  const { backup, report } = await convertPWAToIOS(source);
  assert.deepEqual(source, original);
  assert.deepEqual(backup._spendyMigration.originalBackup, original);
  assert.deepEqual(report.counts, { transactions: 4, accounts: 2, categories: 3, subscriptions: 1 });
  assert.equal(backup.currencyCode, 'INR');
  assert.equal(backup.currencySymbol, '₹');
  assert.equal(backup.appearanceMode, 'Dark');
  assert.equal(backup.topGradientColorHex, '#001A99');
  assert.equal(backup.transactions[0].notes, 'Keep this note 👋');
  assert.equal(backup.transactions[1].amount, 12.25);
  for (const [i, t] of backup.transactions.entries()) assert.equal(Date.parse(t.date), typeof source.transactions[i].date === 'number' ? source.transactions[i].date : Date.parse(source.transactions[i].date));
  assert.equal(backup.categories[0].isHidden, true);
  assert.equal(backup.categories[0].sfSymbol, 'fork.knife');
  assert.equal(backup.categories[0].colorHex, '#FF9500');
  assert.equal(backup.customFolders[0].name, 'My essentials');
  assert.equal(backup.budget.categoryBudgets.food, 50);
});

test('stable IDs preserve subscription payment links and subscription settings', async () => {
  const a = await convertPWAToIOS(migrationFixture());
  const b = await convertPWAToIOS(migrationFixture());
  assert.equal(a.backup.transactions[3].subscriptionId, a.backup.subscriptions[0].id);
  assert.deepEqual(a.backup._spendyMigration.idMap, b.backup._spendyMigration.idMap);
  assert.equal(a.backup.subscriptions[0].autoDeduct, true);
  assert.equal(a.backup.subscriptions[0].isTrial, true);
  assert.equal(a.backup.subscriptions[0].nextBillingDate, '2026-12-05');
});

test('opening balances, expenses, income and both transfer sides balance independently', async () => {
  const { backup, report } = await convertPWAToIOS(migrationFixture());
  const expected = [1000 + 500 - 12.25 - 100 - 9.99, -10 + 100];
  for (const [i, account] of backup.accounts.entries()) {
    const balance = backup.transactions.reduce((sum, tx) => sum + (tx.accountId === account.id ? (tx.type === 'income' ? tx.amount : -tx.amount) : 0) + (tx.type === 'transfer' && tx.toAccountId === account.id ? tx.amount : 0), account.openingBalance);
    assert.ok(Math.abs(balance - expected[i]) < 1e-10);
    assert.equal(report.balances[i].before, report.balances[i].after);
  }
  assert.deepEqual(report.totals, { income: 500, expense: 22.240000000000002, transfer: 100 });
});

test('unknown fields, goals and unmatched historical links remain archived and disclosed', async () => {
  const source = migrationFixture();
  source.transactions[0].subscriptionId = 'sub_deleted';
  source.transactions[0].tags = ['work'];
  source.subscriptions[0].reminderDays = 3;
  source.futureFeature = { enabled: true };
  const { backup, report } = await convertPWAToIOS(source);
  assert.deepEqual(backup._spendyMigration.originalBackup, source);
  assert.match(backup.transactions[0].subscriptionId, /^[0-9a-f-]{36}$/);
  for (const path of ['goals', 'transactions', 'subscriptions[0]', 'backup', 'transactions[0].subscriptionId']) assert.ok(report.warnings.some(w => w.path === path), path);
});

test('ambiguous currency needs confirmation and never exchanges amounts', async () => {
  const source = migrationFixture(); source.currency = '$';
  await assert.rejects(convertPWAToIOS(source), /Confirm the currency/);
  const { backup } = await convertPWAToIOS(source, { currencyCode: 'CAD' });
  assert.equal(backup.currencyCode, 'CAD');
  assert.equal(backup.transactions[0].amount, 500);
});

test('unsupported budgets require explicit archiving and are inactive in iOS', async () => {
  const source = migrationFixture(); source.budget.period = 'yearly';
  await assert.rejects(convertPWAToIOS(source), /Budget period/);
  const { backup, report } = await convertPWAToIOS(source, { archiveUnsupportedBudget: true });
  assert.equal(backup.budget.isActive, false);
  assert.equal(backup.budget.amount, 0);
  assert.equal(backup._spendyMigration.originalBackup.budget.period, 'yearly');
  assert.equal(backup._spendyMigration.originalBackup.budget.amount, 300);
  assert.ok(report.warnings.some(w => w.code === 'archived-budget'));
});

test('category namespaces can collide without breaking typed references', async () => {
  const source = migrationFixture(); source.categories.income[0].id = 'food'; source.transactions[0].category = 'food';
  const { backup } = await convertPWAToIOS(source);
  assert.equal(new Set(backup.categories.map(c => c.id)).size, 3);
  assert.notEqual(backup.transactions[0].categoryId, backup.transactions[1].categoryId);
  assert.equal(backup.transactions[0].categoryId, backup.categories.find(c => c.type === 'income').id);
});

for (const [label, mutate, message] of [
  ['missing source account', s => { s.transactions[0].accountId = 'missing'; }, /account.*missing/],
  ['missing destination account', s => { s.transactions[2].toAccountId = 'missing'; }, /account.*missing/],
  ['self transfer', s => { s.transactions[2].toAccountId = 'bank'; }, /two different accounts/],
  ['missing category', s => { s.transactions[1].category = 'missing'; }, /category.*missing/],
  ['duplicate IDs', s => { s.transactions[1].id = s.transactions[0].id; }, /duplicate IDs/],
  ['invalid amount', s => { s.transactions[0].amount = ''; }, /invalid amount/],
  ['negative amount', s => { s.transactions[0].amount = -5; }, /supported range/],
  ['invalid date', s => { s.transactions[0].date = '2026-02-30'; }, /invalid calendar date/],
  ['invalid month', s => { s.transactions[0].date = '2026-13-01'; }, /invalid calendar date/],
  ['timezone missing', s => { s.transactions[0].date = '2026-11-01T13:00:00'; }, /timezone/],
  ['unsupported billing cycle', s => { s.subscriptions[0].cycle = 'daily'; }, /billing cycle/],
  ['invalid budget start', s => { s.budget.startDay = 31; }, /days 1–28/],
]) test(`refuses ${label} instead of dropping or changing records`, async () => {
  const source = migrationFixture(); mutate(source);
  await assert.rejects(convertPWAToIOS(source), message);
});

test('UUID case collisions are caught, and dictionary-like IDs stay safe', async () => {
  const s = migrationFixture();
  s.transactions[0].id = 'AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA';
  s.transactions[1].id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  await assert.rejects(convertPWAToIOS(s), /same native ID/);
  s.transactions[1].id = '__proto__';
  const { backup } = await convertPWAToIOS(s);
  assert.match(backup.transactions[1].id, /^[0-9a-f-]{36}$/);
});

test('parser rejects other JSON formats, accepts a BOM and never leaks cloud fields from live state', () => {
  for (const input of ['{', '{}', '[]', '{"categories":[],"accounts":[],"transactions":[]}']) assert.throws(() => parsePWABackup(input), ConversionError);
  assert.equal(parsePWABackup('\uFEFF' + JSON.stringify(migrationFixture())).userName, 'Migration Test');
  const backup = createPWABackup({ ...migrationFixture(), session: { token: 'never-export' }, syncMeta: { id: 'private' } });
  assert.equal(backup.session, undefined);
  assert.equal(backup.syncMeta, undefined);
});

test('keeps ordering, expands short hex colors and discloses appearance substitutions', async () => {
  const source = migrationFixture();
  source.accounts[0].order = 9;
  source.categories.expense[0].color = '#abc';
  source.subscriptions[0].color = 'rebeccapurple';
  source.subscriptions[0].icon = { type: 'brand', value: 'spotify' };
  const { backup, report } = await convertPWAToIOS(source);
  assert.equal(backup.accounts[0].order, 9);
  assert.equal(backup.categories[0].colorHex, '#aabbcc');
  assert.equal(backup.subscriptions[0].sfSymbol, 'music.note');
  assert.ok(report.warnings.some(w => w.code === 'appearance-substitution'));
  assert.ok(report.iconMappings.some(i => i.original === 'spotify' && i.approximate));
  assert.deepEqual(backup._spendyMigration.originalBackup, source);
});
