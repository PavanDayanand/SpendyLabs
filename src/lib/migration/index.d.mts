export const MIGRATION_VERSION: number;
export const MAX_BACKUP_BYTES: number;
export const CURRENCY_CHOICES: string[];
export const IOS_ICON_SYMBOLS: string[];
export class ConversionError extends Error { issues: string[]; }
export interface ConversionOptions { currencyCode?: string; archiveUnsupportedBudget?: boolean; }
export interface MigrationReport {
  counts: { transactions: number; accounts: number; categories: number; subscriptions: number };
  currencyCode: string;
  totals: { income: number; expense: number; transfer: number };
  balances: { id: string; label: string; before: number; after: number }[];
  warnings: { code: string; path: string; message: string }[];
  iconMappings: { label: string; original: string; symbol: string; approximate: boolean }[];
  archivedPreferences: string[];
  sourceArchived: boolean;
}
export interface MigrationResult { backup: Record<string, unknown>; report: MigrationReport; }
export function parsePWABackup(raw: string): Record<string, unknown>;
export function createPWABackup(state: Record<string, unknown>): Record<string, unknown>;
export function convertPWAToIOS(input: unknown, options?: ConversionOptions): Promise<MigrationResult>;
export function downloadJSON(data: unknown, filename: string): void;
