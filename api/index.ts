// HONO //
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

// APP //
import app from '../dist/app.js';

/**
 * Vercel Edge Function runtime configuration
 */
export const config = { runtime: 'edge' };

/**
 * Edge Function handler — wraps the Hono app for Vercel's v8 isolate runtime
 */
export default handle(app as Hono);
