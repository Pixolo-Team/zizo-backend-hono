// CONFIG //
import { app } from "./index.js";

// CONSTANTS //
import { DEFAULT_PORT } from "./common/constants/app.constants.js";

// LIBRARIES //
import { serve } from "@hono/node-server";

const PORT = Number(process.env.PORT) || DEFAULT_PORT;

/**
 * Starts the local Node.js HTTP server
 */
serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`Server is running on port ${info.port}`);
});
