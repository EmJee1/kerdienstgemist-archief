import * as z from 'zod';

export const KdgRssFeedItem = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  'itunes:author': z.string().optional(),
  guid: z.object({
    '#text': z.string(),
    '@_isPermaLink': z.stringbool(),
  }),
  enclosure: z.object({
    '@_type': z.enum(['audio/mpeg']),
    '@_url': z.httpUrl(),
  }),
});

export const KdgRssFeedResponse = z.object({
  rss: z.object({
    channel: z.object({
      item: z.array(KdgRssFeedItem),
    }),
  }),
});
