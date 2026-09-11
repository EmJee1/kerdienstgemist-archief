import http from 'node:http';

import { gracefulShutdown } from '@kdg/core/graceful-shutdown';
import { getServiceRetriever } from '@kdg/feed/service-retriever-factory';
import { createFirestoreClient } from '@kdg/firestore/firestore-client';

import { config } from '#config';
import { DiscoverV1ResponseBody } from '#models/discoverV1ResponseBody';

const firestore = createFirestoreClient(config.firestore);

const server = http.createServer(async (req, res) => {
  if (req.url !== '/discover' || req.method !== 'POST') {
    res.writeHead(404, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        error: {
          message: 'The requested endpoint does not exist',
        },
      }),
    );
    return;
  }

  console.log('Received discovery request');

  const serviceRetriever = getServiceRetriever(config.serviceRetriever);
  const feed = await serviceRetriever.getServices(4);
  if (!feed.isOk()) {
    console.log('error', feed.error);
    res.writeHead(502, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        error: {
          message: 'Fetching RSS feed from Kerkdienstgemist failed',
        },
      }),
    );
    return;
  }

  // TODO: verify for each fetched service whether it is already stored
  const servicesToStore = feed.value.map((service) => service.id);

  const response: DiscoverV1ResponseBody = {
    serviceIds: servicesToStore,
    skipped: 0,
    malformed: 0,
    feedFetchedAt: new Date().toUTCString(),
    archiveObject: '',
  };

  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(response));
});

server.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
  console.log(
    `Firestore database "${config.firestore.databaseId}" in project "${config.firestore.projectId}"`,
  );
});

gracefulShutdown(server, {
  onShutdown: async () => {
    await firestore.terminate();
    console.log('Firestore client terminated');
  },
});
