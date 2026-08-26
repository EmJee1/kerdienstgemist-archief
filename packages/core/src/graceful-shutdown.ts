import type { Server } from 'node:http';

const SHUTDOWN_SIGNALS = ['SIGTERM', 'SIGINT'] as const;

// Cloud Run sends SIGTERM and follows up with SIGKILL 10 seconds later, so give
// up well before that: https://docs.cloud.google.com/run/docs/container-contract
const DEFAULT_FORCE_CLOSE_AFTER_MS = 8_000;

/**
 * Stops `server` from accepting new connections on SIGTERM/SIGINT and lets
 * in-flight requests finish, so the process can exit on its own.
 */
export function gracefulShutdown(server: Server, forceCloseAfterMs = DEFAULT_FORCE_CLOSE_AFTER_MS) {
  for (const signal of SHUTDOWN_SIGNALS) {
    // Once, so a second signal falls back to the default action as an escape hatch.
    process.once(signal, () => {
      console.log(`Received ${signal}, closing server`);

      server.close(() => {
        console.log('Server closed');
      });

      const forceClose = setTimeout(() => {
        console.log('In-flight requests did not finish in time, exiting anyway');
        server.closeAllConnections();
        process.exit(1);
      }, forceCloseAfterMs);

      forceClose.unref();
    });
  }
}
