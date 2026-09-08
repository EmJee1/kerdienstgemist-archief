export interface Service {
  id: string;
  startTime: Date;
  /**
   * The pastor that led the service; empty if it is unknown, or wasn't led by a pastor.
   */
  pastor?: string;
  /**
   * A direct URL to download the service from. This URL can be signed with a temporary access key, so refetching might be necessary.
   */
  temporaryDownloadUrl: string;
}
