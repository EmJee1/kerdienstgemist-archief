import type { Server } from 'node:http';

const SHUTDOWN_SIGNALS = ['SIGTERM', 'SIGINT'] as const;

// Cloud Run sends SIGTERM and follows up with SIGKILL 10 seconds later, so give
// up well before that: https://docs.cloud.google.com/run/docs/container-contract
const DEFAULT_FORCE_CLOSE_AFTER_MS = 8_000;

export interface GracefulShutdownOptions {
  /**
   * Releases whatever the service holds open besides the server, such as a
   * database client. Runs once in-flight requests have finished, so it does not
   * pull connections out from under them.
   */
  onShutdown?: () => Promise<void> | void;
  forceCloseAfterMs?: number;
}

/**
 * Stops `server` from accepting new connections on SIGTERM/SIGINT and lets
 * in-flight requests finish, so the process can exit on its own.
 */
export function gracefulShutdown(server: Server, options: GracefulShutdownOptions = {}) {
  const { onShutdown, forceCloseAfterMs = DEFAULT_FORCE_CLOSE_AFTER_MS } = options;

  for (const signal of SHUTDOWN_SIGNALS) {
    // Once, so a second signal falls back to the default action as an escape hatch.
    process.once(signal, () => {
      console.log(`Received ${signal}, closing server`);

      const forceClose = setTimeout(() => {
        console.log('Shutdown did not finish in time, exiting anyway');
        server.closeAllConnections();
        process.exit(1);
      }, forceCloseAfterMs);

      forceClose.unref();

      server.close(async () => {
        console.log('Server closed');

        try {
          await onShutdown?.();
        } catch (error) {
          console.log('Shutdown hook failed', error);
        }

        clearTimeout(forceClose);
      });
    });
  }
}
