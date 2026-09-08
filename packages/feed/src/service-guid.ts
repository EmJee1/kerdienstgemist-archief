import { err, ok, Result } from 'neverthrow';
import * as z from 'zod';

import { KdgRssFeedItem } from '#kerkdienstgemist/models/rss-feed-response';

const expectedGuidPrefix = 'https://kerkdienstgemist.nl/media/';

/**
 * KDG feeds gives a `guid` in a format like this: https://kerkdienstgemist.nl/media/3389759.
 * We want a simple slug for usage as our internal ID and Firestore document ID, so we strip
 * the prefix https://kerkdienstgemist.nl/media/ and just keep the media ID.
 */
export function getServiceGuidForFeedItem(
  feedItem: z.TypeOf<typeof KdgRssFeedItem>,
): Result<string, string> {
  const upstreamGuid = feedItem.guid['#text'];
  if (!upstreamGuid.startsWith(expectedGuidPrefix)) {
    // TODO: when we implement structured logging, include received guid
    return err('Expected KDG item to contain guid, but it did not');
  }

  return ok(upstreamGuid.replace(expectedGuidPrefix, ''));
}
