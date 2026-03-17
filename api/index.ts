// HONO //
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

// APP //
import app from '../dist/app.js';

/**
 * Vercel Serverless Function runtime configuration
 * Using Node.js runtime for @hono/zod-openapi compatibility
 */
export const config = {
  runtime: 'nodejs22.x',
  maxDuration: 30,
};

/**
 * Serverless Function handler — wraps the Hono app for Vercel's Node.js runtime
 */
export default handle(app as Hono);
