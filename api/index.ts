// APP //
import app from '../src/app.js';

/**
 * Vercel Edge Function runtime configuration
 */
export const config = { runtime: 'edge' };

/**
 * Edge Function handler - exports the Hono app's fetch handler
 * for Vercel's v8 isolate runtime
 */
export default app;
