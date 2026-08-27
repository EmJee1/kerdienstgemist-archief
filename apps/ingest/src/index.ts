import http from 'node:http';

import { gracefulShutdown } from '@kdg/core/graceful-shutdown';

import { config } from '#config';

const server = http.createServer(async (req, res) => {
  if (req.url !== '/ingest' || req.method !== 'POST') {
    res.writeHead(404, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        error: {
          message: 'The requested endpoint does not exist',
        },
      }),
    );
    return;
  }

  console.log('Received ingest request');

  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true }));
});

server.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
});

gracefulShutdown(server);
