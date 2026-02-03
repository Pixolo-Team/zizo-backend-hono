import { handle } from "hono/vercel";
import { app } from "../src/app.js";

/**
 * Vercel Serverless Handler
 */
export default handle(app);
