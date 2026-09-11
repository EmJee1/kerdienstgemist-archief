import { ServiceRetrieverConfig } from '@kdg/feed/service-retriever-factory';
import { FirestoreClientConfig } from '@kdg/firestore/models/firestore-client-config';

import { getEnvironment, valueForEnvironment } from '#environment';

function stringConfigOrFail(variable: string) {
  const value = process.env[variable];
  if (!value) {
    console.log(`Missing required environment variable "${variable}"`);
    process.exit(1);
  }

  return value;
}

function hostPortConfigOrFail(variable: string) {
  const [host, port] = stringConfigOrFail(variable).split(':');
  const portNumber = Number(port);

  if (!host || !Number.isInteger(portNumber) || portNumber <= 0) {
    console.log(`Environment variable "${variable}" must look like "host:port"`);
    process.exit(1);
  }

  return {
    host,
    port: portNumber,
  };
}

const serviceRetriever: ServiceRetrieverConfig = {
  type: 'kerkdienstgemist',
  playlistId: stringConfigOrFail('KDG_FEED_ID'),
  accessKey: stringConfigOrFail('KDG_ACCESS_KEY'),
};

const projectId = stringConfigOrFail('GOOGLE_CLOUD_PROJECT');
const databaseId = stringConfigOrFail('FIRESTORE_DATABASE');

const emulator =
  getEnvironment() === 'local' ? hostPortConfigOrFail('FIRESTORE_EMULATOR_HOST') : undefined;

const firestore: FirestoreClientConfig = {
  projectId,
  databaseId,
  emulator,
};

export const config = valueForEnvironment({
  local: {
    port: 8080,
    host: 'localhost',
    serviceRetriever,
    firestore,
  },
  staging: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
    serviceRetriever,
    firestore,
  },
  production: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
    serviceRetriever,
    firestore,
  },
});
