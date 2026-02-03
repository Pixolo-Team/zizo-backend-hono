import { handle } from "hono/vercel";
import { app } from "../src/app";

/**
 * Vercel Serverless Handler
 */
export default handle(app);
