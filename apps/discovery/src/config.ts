import { ServiceRetrieverConfig } from '@kdg/feed/service-retriever-factory';

import { valueForEnvironment } from '#environment';

function stringConfigOrFail(variable: string) {
  const value = process.env[variable];
  if (!value) {
    console.log(`Missing required environment variable "${variable}"`);
    process.exit(1);
  }

  return value;
}

const serviceRetriever: ServiceRetrieverConfig = {
  type: 'kerkdienstgemist',
  playlistId: stringConfigOrFail('KDG_FEED_ID'),
  accessKey: stringConfigOrFail('KDG_ACCESS_KEY'),
};

export const config = valueForEnvironment({
  local: {
    port: 8080,
    host: 'localhost',
    serviceRetriever,
  },
  staging: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
    serviceRetriever,
  },
  production: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
    serviceRetriever,
  },
});
