// LIBRARIES //
import { serve } from "@hono/node-server";

// CONSTANTS //
import { DEFAULT_PORT } from "./common/constants/app.constants.js";

// APP //
import { app } from "./index.js";

/**
 * Starts the local Node.js HTTP server.
 * @returns void
 */
export const startServer = (): void => {
  // Resolve port from env or fall back to default
  const port = Number(process.env.PORT) || DEFAULT_PORT;

  serve({ fetch: app.fetch, port }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  });
};

startServer();
