import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';

// Start an isolated server first; see docs/e2e-visitor-review.md.
export default {
  workers: 1,
  timeout: 60000,
  actionTimeout: 10000,
  reporters: ['list'],
  targets: [
    { name: 'phone-light', width: 390, colorScheme: 'light', reducedMotion: 'no-preference' },
    { name: 'phone-dark-reduced', width: 320, colorScheme: 'dark', reducedMotion: 'reduce' },
    { name: 'desktop-light', width: 1440, colorScheme: 'light', reducedMotion: 'no-preference' },
    { name: 'desktop-dark-reduced', width: 1440, colorScheme: 'dark', reducedMotion: 'reduce' },
  ].map(({ name, width, colorScheme, reducedMotion }) => ({
    name,
    engine: web({ viewport: { width, height: 900 }, colorScheme: colorScheme as 'light' | 'dark', reducedMotion: reducedMotion as 'reduce' | 'no-preference' }),
    app: { url: process.env.APP_URL ?? 'http://127.0.0.1:3013', environment: 'test' as const },
  })),
} satisfies E2EConfig;
