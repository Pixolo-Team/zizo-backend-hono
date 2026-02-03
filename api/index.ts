import { handle } from "@hono/node-server/vercel";
import { app } from "../src/app.js";

/**
 * Vercel Serverless Handler
 */
export default handle(app);
