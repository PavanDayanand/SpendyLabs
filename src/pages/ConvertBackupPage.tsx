import { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Download, FileJson, LockKeyhole, Smartphone, Upload, CircleAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteReducedMotion } from '../AnimationPreferences';
import { CURRENCY_CHOICES, MAX_BACKUP_BYTES, convertPWAToIOS, downloadJSON, parsePWABackup, type MigrationResult } from '../lib/migration/index.mjs';
import './convert-backup.css';

export default function ConvertBackupPage() {
  const reduced = useSiteReducedMotion();
  const input = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<Record<string, unknown> | null>(null);
  const [filename, setFilename] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [archiveBudget, setArchiveBudget] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const revision = useRef(0);

  async function selectFile(file?: File) {
    if (!file || busy) return;
    const current = ++revision.current;
    setError(''); setResult(null); setSource(null); setDownloaded(false);
    setFilename(''); setArchiveBudget(false); setCurrencyCode('');
    if (file.size > MAX_BACKUP_BYTES) { setError('Choose a backup smaller than 20 MB.'); return; }
    setBusy(true);
    try {
      const data = parsePWABackup(await file.text());
      if (current !== revision.current) return;
      setSource(data); setFilename(file.name);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to read this backup.'); }
    finally { setBusy(false); }
  }
  async function prepare() {
    if (!source || busy) return;
    setError(''); setBusy(true); setResult(null); setDownloaded(false);
    try { setResult(await convertPWAToIOS(source, { currencyCode: currencyCode || undefined, archiveUnsupportedBudget: archiveBudget })); }
    catch (err) { setError(err instanceof Error ? err.message : 'The backup could not be converted.'); }
    finally { setBusy(false); }
  }
  function invalidate() { setResult(null); setError(''); setDownloaded(false); }
  const report = result?.report;
  const money = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: report?.currencyCode || 'INR', maximumFractionDigits: 2 }).format(amount);
  const yearlyBudget = source?.budget && typeof source.budget === 'object' && 'period' in source.budget && !['monthly', 'weekly'].includes(String(source.budget.period));

  return (
    <article className="migration-page">
      <div className="migration-intro">
        <p className="eyebrow">PWA → Spendy for iOS</p>
        <h1>Your history.<br /><span>A new home.</span></h1>
        <p>Bring your accounts, spending and subscriptions with you. Turn your Spendy PWA backup into a backup for the iOS app.</p>
        <div className={`migration-journey ${result ? 'is-ready' : ''}`} aria-hidden="true">
          <motion.div className="migration-document" animate={reduced ? undefined : { y: result ? -6 : 0, rotate: result ? -6 : -2 }} transition={{ type: 'spring', bounce: 0, duration: .45 }}><FileJson size={30} /><span>PWA</span><i /><i /><i /></motion.div>
          <ArrowRight className="migration-journey-arrow" size={26} />
          <motion.div className="migration-phone" animate={reduced ? undefined : { y: result ? -6 : 0, rotate: result ? 3 : 0 }} transition={{ type: 'spring', bounce: 0, duration: .45 }}><span className="migration-island" /><Smartphone size={30} /><span>{result ? <Check size={24} /> : 'iOS'}</span></motion.div>
        </div>
        <div className="migration-local"><LockKeyhole size={16} /><span>Converted on your device. Your backup is never uploaded.</span></div>
        <ol className="migration-steps">
          <li><span>01</span> Export JSON from the PWA’s Data & Backup settings.</li>
          <li><span>02</span> Choose the file here and review the conversion.</li>
          <li><span>03</span> Download, then import in the iOS app.</li>
        </ol>
      </div>

      <section className="migration-workbench" aria-labelledby="migration-tool-heading" aria-busy={busy}>
        <div className="migration-tool-heading"><span className="migration-step-number">{result ? '02 / REVIEW' : '01 / YOUR BACKUP'}</span><span>JSON → JSON</span></div>
        <h2 id="migration-tool-heading">{result ? 'Your iOS backup is ready.' : 'Start with your PWA backup.'}</h2>
        <input ref={input} type="file" accept=".json,application/json" aria-label="Choose PWA backup file" disabled={busy} onChange={e => { void selectFile(e.target.files?.[0]); e.target.value = ''; }} hidden />
        <button type="button" className={`migration-dropzone ${dragging ? 'is-dragging' : ''}`} disabled={busy} onClick={() => input.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); void selectFile(e.dataTransfer.files[0]); }}>
          {source ? <FileJson size={25} /> : <Upload size={25} />}
          <strong>{filename || 'Choose a backup'}</strong><span>{source ? 'Choose a different file' : 'or drop your JSON file here · Up to 20 MB'}</span>
        </button>

        {source && <div className="migration-options">
          <label htmlFor="migration-currency">Backup currency <span>Amounts stay the same.</span></label>
          <select id="migration-currency" value={currencyCode} disabled={busy} onChange={e => { setCurrencyCode(e.target.value); invalidate(); }}>
            <option value="">Use the currency saved in my backup</option>
            {CURRENCY_CHOICES.map(code => <option key={code} value={code}>{code}</option>)}
          </select>
          <p>If your backup only saved $ or ¥, choose the exact currency.</p>
          {Boolean(yearlyBudget) && <label className="migration-check"><input type="checkbox" checked={archiveBudget} disabled={busy} onChange={e => { setArchiveBudget(e.target.checked); invalidate(); }} /><span>Keep my unsupported budget in the file archive and disable the budget in iOS. iOS supports monthly and weekly budgets.</span></label>}
        </div>}

        <div role="status" aria-live="polite">{busy && <p className="migration-busy">{source ? 'Checking records, icons and account balances…' : 'Reading your backup…'}</p>}</div>
        {error && <div className="migration-error" role="alert"><CircleAlert size={18} /><p>{error}</p></div>}

        {report && <motion.div className="migration-review" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .22 }}>
          <p className="migration-success"><Check size={17} /> Records converted. Account balances match.</p>
          <dl className="migration-counts">{Object.entries(report.counts).map(([key, count]) => <div key={key}><dd>{count.toLocaleString()}</dd><dt>{key}</dt></div>)}</dl>
          <details className="migration-detail"><summary>Review balances <span>{report.currencyCode}</span></summary><ul>{report.balances.map(a => <li key={a.id}><span>{a.label}</span><strong>{money(a.after)}</strong><Check size={14} aria-label="Matches original" /></li>)}</ul><p>Income {money(report.totals.income)} · Expenses {money(report.totals.expense)} · Transfers {money(report.totals.transfer)}</p></details>
          <details className="migration-detail"><summary>iOS icon matches <span>{report.iconMappings.length}</span></summary><p>Names stay yours. Icons use the native app’s SF Symbols.</p><ul>{report.iconMappings.map((mapping, i) => <li key={i}><span>{mapping.label}<small>{mapping.original}</small></span><code>{mapping.symbol}</code></li>)}</ul></details>
          {report.warnings.length > 0 && <details className="migration-detail migration-notes" open><summary>Review conversion notes <span>{report.warnings.length}</span></summary><ul>{report.warnings.slice(0, 100).map((warning, i) => <li key={i}>{warning.message}</li>)}</ul>{report.warnings.length > 100 && <p>All {report.warnings.length} notes are included in the downloaded file.</p>}</details>}
          <div className="migration-archive"><strong>Your original data travels with the file.</strong><p>A complete source archive is included. PWA-only fields stay in that archive; iOS does not display them or retain them in its own later exports. Keep this downloaded file.</p></div>
        </motion.div>}

        {!result ? <button type="button" className="migration-primary" disabled={!source || busy} onClick={() => void prepare()}>{busy ? 'Preparing…' : 'Prepare iOS backup'}<ArrowRight size={18} /></button> : <button type="button" className="migration-primary" onClick={() => { downloadJSON(result.backup, `Spendy_iOS_Import_${new Date().toISOString().slice(0, 10)}.json`); setDownloaded(true); }}><Download size={18} />{downloaded ? 'Download again' : 'Download iOS backup'}</button>}
        {downloaded && <div className="migration-next" role="status"><ArrowDown size={18} /><div><strong>Next: import in Spendy for iOS.</strong><p>Open Settings → Data Management → Import JSON. Import replaces the iOS app’s current data, so export an iOS backup first if you already use it.</p></div></div>}
        <p className="migration-footnote">Your source file stays unchanged. No sign-in needed.</p>
      </section>
    </article>
  );
}
