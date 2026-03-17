/*
 * Bundles the Vercel Edge Function entry point using esbuild.
 *
 * All hono internals (including hono/utils/url) are inlined into a single
 * self-contained ESM bundle so Vercel's v8 isolate checker never sees any
 * external hono/* module references at runtime.
 */

// ESBUILD //
import { build } from 'esbuild';

await build({
  // Entry: the TypeScript edge function source
  entryPoints: ['api/index.ts'],

  // Inline every import — no external hono/* references in the output
  bundle: true,

  // Target Vercel's v8 isolate (browser-compatible Web APIs only)
  platform: 'browser',
  format: 'esm',
  target: 'esnext',

  // Output: the pre-bundled JS Vercel will deploy
  outfile: 'api/index.js',
  allowOverwrite: true,

  // Read tsconfig to resolve @/ path aliases
  tsconfig: './tsconfig.json',

  // Minify for smaller bundle size
  minify: true,
});
