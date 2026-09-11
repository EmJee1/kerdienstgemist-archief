import { Firestore, Settings } from '@google-cloud/firestore';

import { FirestoreClientConfig } from '#models/firestore-client-config';

/**
 * Builds the Firestore client a service uses for its whole lifetime.
 *
 * A client owns an authenticated transport and a cached access token, so create
 * one at startup and share it. Creating one per request piles up connections and
 * re-authenticates every time. Nothing connects here; the first read or write
 * opens the connection.
 *
 * Call `terminate()` on the returned client during shutdown to let in-flight
 * operations settle and release the transport.
 */
export function createFirestoreClient(config: FirestoreClientConfig): Firestore {
  return new Firestore(settingsFor(config));
}

function settingsFor(config: FirestoreClientConfig): Settings {
  const settings: Settings = {
    // Resolved lazily, from the metadata server when the service runs on GCP.
    projectId: config.projectId,
    databaseId: config.databaseId,

    ignoreUndefinedProperties: true,

    // Stay on HTTP/1.1 so gRPC libs are not loaded
    preferRest: true,
  };

  if (!config.emulator) {
    return settings;
  }

  return {
    ...settings,
    host: config.emulator.host,
    port: config.emulator.port,
    ssl: false,
    preferRest: false,
  };
}
