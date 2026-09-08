import { XMLParser } from 'fast-xml-parser';
import { err, fromPromise, ok, Result } from 'neverthrow';
import { z } from 'zod';

import { KdgRssFeedResponse, KdgRssFeedItem } from '#kerkdienstgemist/models/rss-feed-response';
import { KdgServiceRetrieverConfig } from '#kerkdienstgemist/models/service-retriever-config';
import { Service } from '#models/service';
import { getServiceGuidForFeedItem } from '#service-guid';
import { ServiceRetriever, ServiceRetrieverError } from '#service-retriever';

export class KerkdienstgemistServiceRetriever implements ServiceRetriever {
  constructor(private readonly config: KdgServiceRetrieverConfig) {}

  public async getServices(limit: number): Promise<Result<Service[], ServiceRetrieverError>> {
    const feed = await this.fetchAndParseKdgRssFeed(limit);
    if (!feed.isOk()) {
      return err(feed.error);
    }

    return Result.combine(
      feed.value.rss.channel.item.map((s) => this.mapKdgServiceToInternalService(s)),
    );
  }

  private async fetchAndParseKdgRssFeed(
    limit: number,
  ): Promise<Result<z.TypeOf<typeof KdgRssFeedResponse>, ServiceRetrieverError>> {
    const url = new URL(`https://kerkdienstgemist.nl/playlists/${this.config.playlistId}.rss`);
    url.search = new URLSearchParams({
      access_key: this.config.accessKey,
      media: 'audio',
      limit: limit.toString(),
    }).toString();

    const response = await fromPromise(fetch(url), (e) => e);
    if (response.isErr()) {
      return err({
        kind: 'network',
        cause: response.error,
      });
    }

    if (!response.value.ok) {
      return err({
        kind: 'httpStatus',
        status: response.value.status,
        // TODO: include response-body
      });
    }

    const rssFeedRawText = await fromPromise(response.value.text(), (e) => e);
    if (rssFeedRawText.isErr()) {
      return err({
        kind: 'decode',
        cause: rssFeedRawText.error,
      });
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      // Without this a single-item feed (limit=1) parses <item> as an object instead of an array.
      isArray: (_name, jpath) => jpath === 'rss.channel.item',
    });

    const parsed = Result.fromThrowable(
      () => parser.parse(rssFeedRawText.value),
      (e) => e,
    )();
    if (parsed.isErr()) {
      return err({
        kind: 'parse',
        cause: parsed.error,
      });
    }

    const feed = KdgRssFeedResponse.safeParse(parsed.value);
    if (!feed.success) {
      return err({
        kind: 'parse',
        cause: feed.error,
      });
    }

    return ok(feed.data);
  }

  private mapKdgServiceToInternalService(
    service: z.TypeOf<typeof KdgRssFeedItem>,
  ): Result<Service, ServiceRetrieverError> {
    const guid = getServiceGuidForFeedItem(service);
    if (guid.isErr()) {
      return err({
        kind: 'parse',
        cause: guid.error,
      });
    }

    return ok({
      id: guid.value,
      startTime: service.pubDate,
      pastor: service['itunes:author'],
      temporaryDownloadUrl: service.enclosure['@_url'],
    });
  }
}
