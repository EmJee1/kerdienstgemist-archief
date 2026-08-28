export interface DiscoverV1ResponseBody {
  serviceIds: string[];

  /**
   * In feed but already terminal (STORED or FAILED_PERMANENT).
   */
  skipped: number;

  /**
   *  Items present in the feed that could not be parsed into a record.
   */
  malformed: number;
  feedFetchedAt: string;
  archiveObject: string;
}
