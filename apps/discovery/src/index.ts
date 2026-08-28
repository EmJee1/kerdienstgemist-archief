import http from 'node:http';

import { gracefulShutdown } from '@kdg/core/graceful-shutdown';
import { fetchKdgRssFeed } from '@kdg/feed/fetch';
import { getServiceGuidForFeedItem } from '@kdg/feed/service-guid';

import { config } from '#config';
import { DiscoverV1ResponseBody } from '#models/discoverV1ResponseBody';

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

  const feed = await fetchKdgRssFeed(config.kdgFeed.id, config.kdgFeed.accessKey, 4);
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
  const servicesToStore = feed.value.rss.channel.item.map((item) =>
    getServiceGuidForFeedItem(item),
  );

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
});

gracefulShutdown(server);
