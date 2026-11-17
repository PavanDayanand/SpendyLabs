// Canonical migration engine. scripts/sync-migration.mjs distributes this file
// to the PWA; keep both entry points on the same format and conversion rules.
export const MIGRATION_VERSION = 1;
export const MAX_BACKUP_BYTES = 20 * 1024 * 1024;
export const CURRENCY_CHOICES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD', 'HKD', 'NZD', 'CNY', 'AED', 'CHF'];

export class ConversionError extends Error {
  constructor(issues) {
    super(issues.join('\n'));
    this.name = 'ConversionError';
    this.issues = issues;
  }
}

// These are SF Symbol names used by the native app, not remote icon assets.
const SYMBOL_GROUPS = {
  'fork.knife': 'fastfood food dining restaurant restaurants restaurant_menu restaurant_ri pizza mcdonalds ubereats doordash',
  'cup.and.saucer.fill': 'coffee cafe cup starbucks',
  'cart.fill': 'groceries cart shopping_cart instacart',
  'car.fill': 'transport taxi car_ri car uber lyft tesla',
  'tram.fill': 'transit train public_transport subway commute',
  'bus.fill': 'bus',
  'fuelpump.fill': 'gas fuel',
  'film.fill': 'movies movie film_ri entertainment netflix disney youtube twitch',
  'banknote.fill': 'money paycheck cash atm refund salary currency_ri',
  'building.columns.fill': 'bank bank_ri bankAccount',
  'creditcard.fill': 'card card_ri creditcard credit_card visa mastercard stripe paypal pricechange',
  'dollarsign.circle.fill': 'savings investment investments stock coinbase binance ethereum bitcoin',
  'receipt': 'receipt subscriptions bill bill_ri',
  'leaf.fill': 'spa leaf garden yard',
  'pawprint.fill': 'pets pet',
  'house.fill': 'home home_ri house rent housing cabin airbnb',
  'shippingbox.fill': 'amazon delivery package shipping',
  'scissors': 'cut scissors beauty salon',
  'heart.fill': 'favorite health heart heart_pulse patreon',
  'tshirt.fill': 'drycleaning clothing tshirt tshirt_ri closet',
  'bag.fill': 'shopping bag bag_ri',
  'storefront.fill': 'store convenience',
  'eyeglasses': 'glasses eyeglasses',
  'pencil.and.ruler.fill': 'brush design',
  'cross.case.fill': 'medical medicine hospital medicine_ri pharmacy healing tooth',
  'laptopcomputer': 'work freelance laptop computer nvidia microsoft windows aws',
  'gift.fill': 'gift gifts gift_ri',
  'figure.2.and.child.holdinghands': 'family',
  'tag.fill': 'tag Tag label',
  'bolt.fill': 'bolt electricity utilities energy solar',
  'wifi': 'wifi internet router',
  'graduationcap.fill': 'education school grad_ri duolingo',
  'airplane': 'travel flight airplane plane_ri',
  'shield.fill': 'insurance shield security nordvpn proton',
  'dumbbell.fill': 'fitness gym nike adidas strava',
  'music.note': 'music spotify audible soundcloud',
  'apple.logo': 'apple',
  'sparkles': 'openai chatgpt claude gemini',
  'camera.fill': 'instagram camera camera_alt snapchat',
  'bubble.left.and.bubble.right.fill': 'whatsapp chat discord twitter facebook reddit telegram slack',
  'arrow.triangle.2.circlepath': 'repeat Repeat recurring',
  'wineglass.fill': 'bar wine drink cocacola',
  'birthday.cake.fill': 'cake icecream',
  'bicycle': 'bike pedalbike',
  'motorcycle.fill': 'motorcycle',
  'parkingsign.circle.fill': 'parking',
  'bolt.car.fill': 'ev',
  'ferry.fill': 'boat',
  'suitcase.fill': 'luggage beach',
  'drop.fill': 'water opacity',
  'iphone': 'phone gadgets smarthome',
  'tv.fill': 'tv',
  'hammer.fill': 'gavel',
  'chart.line.uptrend.xyaxis': 'growth',
  'figure.run': 'running',
  'figure.mind.and.body': 'yoga',
  'gamecontroller.fill': 'gaming gamepad_ri playstation xbox steam roblox',
  'theatermasks.fill': 'comedy',
  'headphones': 'headphones audio',
  'mic.fill': 'mic',
  'video.fill': 'video zoom tiktok',
  'soccerball': 'soccer',
  'basketball.fill': 'basketball',
  'tennis.racket': 'tennis',
  'figure.golf': 'golf',
  'figure.pool.swim': 'pool',
  'dice.fill': 'casino',
  'trophy.fill': 'awards',
  'key.fill': 'keys key 1password bitwarden',
  'lock.fill': 'lock',
  'bed.double.fill': 'bed',
  'chair.fill': 'chair',
  'refrigerator.fill': 'kitchen',
  'bubbles.and.sparkles.fill': 'cleaning',
  'washer.fill': 'laundry iron',
  'wrench.and.screwdriver.fill': 'maintenance tools handyman',
  'figure.and.child.holdinghands': 'kids daycare',
  'briefcase.fill': 'business linkedin',
  'book.fill': 'book book_ri menubook notion medium substack',
  'printer.fill': 'print',
  'envelope.fill': 'post',
  'atom': 'science',
  'building.2.fill': 'architecture',
  'paintpalette.fill': 'palette figma canva',
  'star.fill': 'star',
  'globe': 'google',
  'chevron.left.forwardslash.chevron.right': 'github',
};
const SYMBOLS = Object.fromEntries(Object.entries(SYMBOL_GROUPS).flatMap(([symbol, keys]) => keys.split(' ').map(key => [key.toLowerCase(), symbol])));
Object.assign(SYMBOLS, { '🏦': 'building.columns.fill', '💵': 'banknote.fill', '💳': 'creditcard.fill', '🍔': 'fork.knife', '🍕': 'fork.knife', '🛒': 'cart.fill', '🎁': 'gift.fill', '🏠': 'house.fill', '🚗': 'car.fill' });
export const IOS_ICON_SYMBOLS = [...new Set(Object.values(SYMBOLS))];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_FOLDERS = new Set(['Everyday Spending', 'Transport', 'Living', 'Personal & Wellness', 'Salary & Career', 'Investments & Other', 'Uncategorized']);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const fail = message => { throw new ConversionError([message]); };
const text = (value, path) => typeof value === 'string' && value.trim() ? value : fail(`${path}: a non-empty text value is required.`);
const number = (value, path, negative = false) => {
  if (!(typeof value === 'number' || (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim())))) fail(`${path}: invalid amount.`);
  const result = Number(value);
  if (!Number.isFinite(result) || Math.abs(result) > Number.MAX_SAFE_INTEGER || (!negative && result < 0)) fail(`${path}: amount is outside the supported range.`);
  return result;
};
const boolean = (value, fallback, path) => value === undefined ? fallback : typeof value === 'boolean' ? value : fail(`${path}: expected true or false.`);
const color = (value, fallback) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
const list = (value, path, optional = false) => {
  if (value === undefined && optional) return [];
  if (!Array.isArray(value) || value.some(row => !object(row))) fail(`${path}: expected a list of records.`);
  return value;
};
const unique = (rows, path) => {
  const ids = rows.map((row, index) => text(row.id, `${path}[${index}].id`));
  if (new Set(ids).size !== ids.length) fail(`${path}: duplicate IDs must be resolved before conversion.`);
};

export function parsePWABackup(raw) {
  if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) fail('Choose a backup smaller than 20 MB.');
  let value;
  try { value = JSON.parse(raw.replace(/^\uFEFF/, '')); }
  catch { fail('This file is not valid JSON. Choose an original Spendy PWA backup.'); }
  if (!object(value) || !object(value.categories) || !Array.isArray(value.accounts) || !Array.isArray(value.transactions)) {
    fail('Choose a Spendy PWA backup with accounts, transactions and grouped categories. This is not a PWA backup.');
  }
  return value;
}

// No auth/session/cloud credentials are included in an export of live PWA state.
export function createPWABackup(state) {
  const keys = ['transactions', 'budget', 'currency', 'currencyCode', 'accounts', 'categories', 'goals', 'subscriptions', 'userName', 'theme', 'hasSeenOnboarding', 'customFolders', 'soundEnabled', 'hapticsEnabled', 'topGradientColor', 'enableGradient', 'cardShape', 'lastUsedType'];
  return JSON.parse(JSON.stringify(Object.fromEntries(keys.filter(key => state[key] !== undefined).map(key => [key, state[key]]))));
}

async function stableUUID(kind, sourceId) {
  if (UUID_RE.test(sourceId)) return sourceId.toLowerCase();
  // Hash the full original ID. Stripping tx_/sub_ can create collisions and
  // generate unrelated IDs for subscriptions and their payment references.
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`spendy-migration-v1:${kind}:${sourceId}`))).slice(0, 16);
  bytes[6] = (bytes[6] & 15) | 80;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function date(value, path) {
  let ms;
  if (typeof value === 'number' && Number.isFinite(value)) ms = value > 10_000_000_000 ? value : value * 1000;
  else if (typeof value === 'string') {
    // Refuse locale-dependent dates and timezone-less times. Date-only billing
    // dates remain date-only so the native decoder applies its own calendar.
    const day = /^\d{4}-\d{2}-\d{2}$/.test(value);
    const instant = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.test(value);
    if (!day && !instant) fail(`${path}: use an ISO date with a timezone, or YYYY-MM-DD.`);
    ms = Date.parse(value);
    const dayPart = value.slice(0, 10);
    const calendarDate = new Date(`${dayPart}T00:00:00Z`);
    if (!Number.isFinite(calendarDate.getTime()) || calendarDate.toISOString().slice(0, 10) !== dayPart) fail(`${path}: invalid calendar date.`);
    if (day && Number.isFinite(ms)) return value;
  }
  if (!Number.isFinite(ms) || !Number.isFinite(new Date(ms).getTime())) fail(`${path}: a valid date is required.`);
  return new Date(ms).toISOString();
}

export async function convertPWAToIOS(input, options = {}) {
  // Snapshot once, never mutate the live application state or source file.
  const source = parsePWABackup(JSON.stringify(input));
  const warnings = [];
  const iconMappings = [];
  const warn = (code, path, message) => warnings.push({ code, path, message });
  const nativeColor = (value, fallback, path) => {
    if (typeof value === 'string' && /^#[0-9a-f]{3}$/i.test(value)) return '#' + [...value.slice(1)].map(c => c + c).join('');
    if (value !== undefined && value !== null && !/^#[0-9a-f]{6}$/i.test(String(value))) warn('appearance-substitution', path, `${path}: the original color is kept in the archive; the iOS icon uses its default color.`);
    return color(value, fallback);
  };
  const archiveExtras = (row, known, path) => {
    const extra = Object.keys(row).filter(key => !known.split(' ').includes(key));
    if (extra.length) warn('archive-only', path, `${path}: PWA-only fields (${extra.join(', ')}) are kept in the file archive and are not restored into the iOS app.`);
  };
  const icon = (row, label, path, fallback) => {
    const original = row.iconName || (object(row.icon) ? row.icon.value : row.icon) || row.emoji || '';
    const mapped = SYMBOLS[String(original).toLowerCase()];
    const symbol = mapped || fallback;
    const approximate = !mapped || row.iconType === 'brand' || (object(row.icon) && row.icon.type === 'brand');
    iconMappings.push({ label, original: String(original || 'Default'), symbol, approximate });
    if (approximate && original) warn('icon-substitution', path, `${label}: “${original}” uses ${symbol} on iOS. The original icon is kept in the source archive.`);
    return symbol;
  };
  const accountsIn = list(source.accounts, 'accounts');
  const txIn = list(source.transactions, 'transactions');
  const subsIn = list(source.subscriptions, 'subscriptions', true);
  const expenseIn = list(source.categories.expense, 'categories.expense');
  const incomeIn = list(source.categories.income, 'categories.income');
  archiveExtras(source.categories, 'expense income', 'categories');
  for (const [rows, path] of [[accountsIn, 'accounts'], [txIn, 'transactions'], [subsIn, 'subscriptions'], [expenseIn, 'categories.expense'], [incomeIn, 'categories.income']]) unique(rows, path);
  if (accountsIn.length === 0) fail('The backup needs at least one account.');
  if (txIn.length + subsIn.length > 100_000) fail('This backup exceeds the 100,000-record browser conversion limit.');

  const knownCurrency = { '₹': 'INR', '€': 'EUR', '£': 'GBP' };
  const rawCurrency = source.currencyCode || source.currency;
  const inferred = typeof rawCurrency === 'string' && /^[A-Z]{3}$/.test(rawCurrency) ? rawCurrency : knownCurrency[rawCurrency];
  const currencyCode = options.currencyCode || inferred;
  if (!currencyCode || !/^[A-Z]{3}$/.test(currencyCode)) fail('Confirm the currency below. This backup only contains an ambiguous currency symbol.');
  try { new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode }); } catch { fail('Choose a valid three-letter currency code.'); }
  if (options.currencyCode && options.currencyCode !== inferred) warn('currency-confirmation', 'currency', `Currency confirmed as ${currencyCode}. Amounts are unchanged; no exchange rate is applied.`);
  const currencySymbol = new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode, currencyDisplay: 'narrowSymbol' }).formatToParts(0).find(p => p.type === 'currency')?.value || currencyCode;

  const accountIds = new Set(accountsIn.map(a => a.id));
  const accounts = accountsIn.map((a, i) => {
    archiveExtras(a, 'id label icon color colorHex openingBalance order type', `accounts[${i}]`);
    const label = text(a.label, `accounts[${i}].label`);
    const type = a.type || (a.id.toLowerCase().includes('cash') || a.icon === '💵' || a.icon === 'cash' ? 'Cash' : a.icon === 'card' || a.icon === '💳' ? 'Other' : 'Bank');
    if (!['Cash', 'Bank', 'Amazon Pay', 'Savings', 'Digital wallet', 'Other'].includes(type)) fail(`accounts[${i}].type: “${type}” is not supported by iOS.`);
    return { id: a.id, label, sfSymbol: icon(a, label, `accounts[${i}].icon`, type === 'Cash' ? 'banknote.fill' : type === 'Other' ? 'creditcard.fill' : 'building.columns.fill'), colorHex: nativeColor(a.colorHex || a.color, type === 'Cash' ? '#34C759' : '#007AFF', `accounts[${i}].color`), openingBalance: number(a.openingBalance ?? 0, `accounts[${i}].openingBalance`, true), order: Number.isInteger(a.order) ? a.order : i, type };
  });

  const categoryIds = new Set();
  const categoryMap = new Map();
  const categories = [];
  for (const [type, rows] of [['expense', expenseIn], ['income', incomeIn]]) {
    for (const [i, c] of rows.entries()) {
      archiveExtras(c, 'id label icon iconType iconName emoji color colorHex hidden isHidden folder order type', `categories.${type}[${i}]`);
      let id = c.id;
      // The PWA separates expense and income namespaces; iOS uses one list.
      if (categoryIds.has(id)) {
        id = `migrated_${type}_${c.id}`;
        while (categoryIds.has(id) || expenseIn.some(row => row.id === id) || incomeIn.some(row => row.id === id)) id = `_${id}`;
      }
      categoryIds.add(id);
      categoryMap.set(`${type}:${c.id}`, id);
      const label = text(c.label, `categories.${type}[${i}].label`);
      const folder = c.folder === undefined ? (type === 'income' ? 'Salary & Career' : 'Everyday Spending') : typeof c.folder === 'string' ? c.folder : fail(`${label}: invalid folder.`);
      categories.push({ id, label, sfSymbol: icon(c, label, `categories.${type}[${i}].icon`, type === 'income' ? 'banknote.fill' : 'tag.fill'), colorHex: nativeColor(c.colorHex || c.color, '#3478F6', `${label}.color`), type, folder, isHidden: boolean(c.hidden ?? c.isHidden, false, `${label}.hidden`), order: Number.isInteger(c.order) ? c.order : i });
    }
  }
  const resolveCategory = (id, type, path) => {
    const mapped = categoryMap.get(`${type}:${id}`);
    if (!mapped) fail(`${path}: category “${id}” is missing from the ${type} categories. Restore it before converting.`);
    return mapped;
  };
  const account = (id, path) => accountIds.has(id) ? id : fail(`${path}: account “${id ?? ''}” is missing. Restore it before converting.`);
  const idMap = { transactions: Object.create(null), subscriptions: Object.create(null) };
  for (const s of subsIn) idMap.subscriptions[s.id] = await stableUUID('subscription', s.id);
  for (const t of txIn) idMap.transactions[t.id] = await stableUUID('transaction', t.id);
  if (new Set(Object.values(idMap.transactions)).size !== txIn.length || new Set(Object.values(idMap.subscriptions)).size !== subsIn.length) fail('Two records map to the same native ID. Resolve the conflicting IDs before conversion.');

  const subscriptions = subsIn.map((s, i) => {
    const path = `subscriptions[${i}]`;
    archiveExtras(s, 'id name title amount cycle billingCycle billing_cycle nextBilling nextBillingDate next_billing_date next_billing date startDate start_date billingDate category categoryId account accountId autoDeduct isPaused isTrial is_trial status icon iconType iconName emoji color colorHex isDarkBadge', path);
    const name = text(s.name || s.title, `${path}.name`);
    const cycle = s.cycle || s.billingCycle || s.billing_cycle || 'monthly';
    if (!['weekly', 'monthly', 'yearly'].includes(cycle)) fail(`${path}: billing cycle “${cycle}” is not supported by iOS.`);
    const status = s.status || (s.isPaused ? 'paused' : 'active');
    if (!['active', 'paused', 'cancelled'].includes(status)) fail(`${path}: subscription status “${status}” is not supported by iOS.`);
    return { id: idMap.subscriptions[s.id], name, amount: number(s.amount, `${path}.amount`), cycle, nextBillingDate: date(s.nextBilling || s.nextBillingDate || s.next_billing_date || s.next_billing || s.date || s.startDate || s.start_date || s.billingDate, `${path}.nextBilling`), categoryId: resolveCategory(s.category || s.categoryId || 'subscriptions', 'expense', `${path}.category`), accountId: account(s.account || s.accountId, `${path}.account`), autoDeduct: boolean(s.autoDeduct, false, `${path}.autoDeduct`), isPaused: boolean(s.isPaused, status === 'paused', `${path}.isPaused`), isTrial: boolean(s.isTrial ?? s.is_trial, false, `${path}.isTrial`), status, sfSymbol: icon(s, name, `${path}.icon`, 'arrow.triangle.2.circlepath'), colorHex: nativeColor(s.colorHex || s.color, '#5856D6', `${path}.color`), isDarkBadge: boolean(s.isDarkBadge, true, `${path}.isDarkBadge`) };
  });

  const transactions = [];
  for (const [i, t] of txIn.entries()) {
    const path = `transactions[${i}]`;
    if (!['income', 'expense', 'transfer'].includes(t.type)) fail(`${path}.type: invalid transaction type.`);
    const from = account(t.accountId || t.account, `${path}.account`);
    const result = { id: idMap.transactions[t.id], title: text(t.title || t.note, `${path}.title`), amount: number(t.amount, `${path}.amount`), type: t.type, categoryId: t.type === 'transfer' ? 'transfer' : resolveCategory(t.category || t.categoryId, t.type, `${path}.category`), accountId: from, date: date(t.date, `${path}.date`) };
    if (t.type === 'transfer') {
      result.toAccountId = account(t.toAccountId, `${path}.toAccountId`);
      if (result.toAccountId === from) fail(`${path}: a transfer needs two different accounts.`);
    } else if (t.toAccountId != null) result.toAccountId = account(t.toAccountId, `${path}.toAccountId`);
    if (t.toAmount != null) result.toAmount = number(t.toAmount, `${path}.toAmount`);
    if (t.notes !== undefined && t.notes !== null) {
      if (typeof t.notes !== 'string') fail(`${path}.notes: expected text.`);
      result.notes = t.notes;
    }
    if (t.subscriptionId) {
      text(t.subscriptionId, `${path}.subscriptionId`);
      result.subscriptionId = idMap.subscriptions[t.subscriptionId] || await stableUUID('subscription', t.subscriptionId);
      if (!idMap.subscriptions[t.subscriptionId]) warn('unmatched-subscription', `${path}.subscriptionId`, `${result.title}: its historical subscription is absent from the backup. The reference is preserved, without inventing a subscription.`);
    }
    transactions.push(result);
  }

  let budgetIn = source.budget ?? { amount: 0, isActive: false };
  if (typeof budgetIn === 'number') budgetIn = { amount: budgetIn };
  if (!object(budgetIn)) fail('budget: invalid budget structure.');
  const amount = number(budgetIn.amount ?? 0, 'budget.amount');
  const unsupportedBudget = !['monthly', 'weekly'].includes(budgetIn.period || 'monthly');
  if (unsupportedBudget && !options.archiveUnsupportedBudget) fail(`Budget period “${budgetIn.period}” is not supported by iOS. You can explicitly keep it in the file archive with the iOS budget disabled, or change it in the PWA first.`);
  if (unsupportedBudget) warn('archived-budget', 'budget', `The ${budgetIn.period} budget is kept in the source archive. The iOS budget is disabled; its amount and period have not been converted into a different active budget.`);
  const startDay = budgetIn.startDay ?? 1;
  if (!Number.isInteger(startDay) || startDay < 1 || startDay > 28) fail('budget.startDay: iOS supports days 1–28. Update the budget start day before conversion.');
  const categoryBudgets = Object.create(null);
  if (budgetIn.categoryBudgets !== undefined && !object(budgetIn.categoryBudgets)) fail('budget.categoryBudgets: expected category limits.');
  for (const [id, limit] of Object.entries(budgetIn.categoryBudgets || {})) categoryBudgets[resolveCategory(id, 'expense', 'budget.categoryBudgets')] = number(limit, `budget.categoryBudgets.${id}`);
  const budget = { amount: unsupportedBudget ? 0 : amount, period: unsupportedBudget ? 'monthly' : budgetIn.period || 'monthly', startDay, isActive: unsupportedBudget ? false : boolean(budgetIn.isActive, amount > 0, 'budget.isActive'), categoryBudgets: unsupportedBudget ? {} : categoryBudgets };
  archiveExtras(budgetIn, 'amount period startDay isActive categoryBudgets', 'budget');

  const folderKeys = new Set();
  const customFolders = [];
  const addFolder = async (name, type) => {
    const key = `${type}:${name}`;
    if (!folderKeys.has(key)) {
      folderKeys.add(key);
      customFolders.push({ id: await stableUUID('folder', key), name, type });
    }
  };
  for (const c of categories) if (c.folder && !DEFAULT_FOLDERS.has(c.folder)) await addFolder(c.folder, c.type);
  for (const f of list(source.customFolders, 'customFolders', true)) {
    if (!object(f) || !['income', 'expense'].includes(f.type)) fail('customFolders: folder type must be income or expense.');
    await addFolder(text(f.name, 'customFolders.name'), f.type);
  }
  const sourceBalances = Object.fromEntries(accounts.map(a => [a.id, a.openingBalance]));
  const targetBalances = { ...sourceBalances };
  const totals = { income: 0, expense: 0, transfer: 0 };
  for (const [i, t] of transactions.entries()) {
    const original = txIn[i];
    totals[t.type] += t.amount;
    sourceBalances[t.accountId] += original.type === 'income' ? Number(original.amount) : -Number(original.amount);
    targetBalances[t.accountId] += t.type === 'income' ? t.amount : -t.amount;
    if (t.type === 'transfer') {
      // Both apps currently use amount for each side of a transfer.
      // Keep legacy toAmount as metadata without altering either balance.
      sourceBalances[t.toAccountId] += Number(original.amount);
      targetBalances[t.toAccountId] += t.amount;
    }
  }
  if (Object.keys(sourceBalances).some(id => sourceBalances[id] !== targetBalances[id] || !Number.isFinite(targetBalances[id]))) fail('Account balances do not match after conversion. No file was generated.');
  if (source.goals?.length) warn('archive-only', 'goals', 'Goals are preserved in the file archive. The current iOS backup format has no goals field.');
  archiveExtras(source, 'transactions accounts categories subscriptions budget currency currencyCode userName customFolders goals theme hasSeenOnboarding soundEnabled hapticsEnabled topGradientColor enableGradient cardShape lastUsedType', 'backup');
  const ignored = ['cardShape', 'lastUsedType', 'theme', 'hasSeenOnboarding'];
  const extraTransactionFields = new Set(txIn.flatMap(t => Object.keys(t).filter(key => !['id', 'title', 'note', 'amount', 'type', 'category', 'categoryId', 'account', 'accountId', 'toAccountId', 'toAmount', 'date', 'notes', 'subscriptionId'].includes(key))));
  if (extraTransactionFields.size) warn('archive-only', 'transactions', `PWA-only transaction fields (${[...extraTransactionFields].join(', ')}) remain in the file archive, not the iOS ledger.`);
  const balances = accounts.map(a => ({ id: a.id, label: a.label, before: sourceBalances[a.id], after: targetBalances[a.id] }));
  const report = { counts: { transactions: transactions.length, accounts: accounts.length, categories: categories.length, subscriptions: subscriptions.length }, currencyCode, totals, balances, warnings, iconMappings, archivedPreferences: ignored.filter(key => source[key] !== undefined), sourceArchived: true };
  const backup = { userName: typeof source.userName === 'string' ? source.userName : '', transactions, accounts, categories, subscriptions, budget, currencyCode, currencySymbol, customFolders, isMonoIconMode: true, hasCompletedOnboarding: true };
  if (['light', 'dark', 'system'].includes(source.theme)) backup.appearanceMode = source.theme[0].toUpperCase() + source.theme.slice(1);
  if (source.soundEnabled !== undefined) backup.soundEnabled = boolean(source.soundEnabled, true, 'soundEnabled');
  if (source.hapticsEnabled !== undefined) backup.hapticsEnabled = boolean(source.hapticsEnabled, true, 'hapticsEnabled');
  if (source.enableGradient !== undefined) backup.isGradientBackgroundEnabled = boolean(source.enableGradient, true, 'enableGradient');
  if (source.topGradientColor) backup.topGradientColorHex = nativeColor(source.topGradientColor, '#007AFF', 'topGradientColor');
  // iOS ignores this extra key. It retains every original JSON field in the
  // downloaded file, including fields that the native app cannot represent.
  // Native re-export does NOT retain this archive; the UI explains that limit.
  backup._spendyMigration = { version: MIGRATION_VERSION, source: 'Spendy PWA', idMap, report, originalBackup: source };
  return { backup, report };
}

export function downloadJSON(data, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Give Safari time to begin consuming the Blob before releasing it.
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
