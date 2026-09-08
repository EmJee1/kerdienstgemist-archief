export interface KdgServiceRetrieverConfig {
  type: 'kerkdienstgemist';
  /**
   * The ID of the KDG playlist to retrieve services from, as found in the playlist URL.
   */
  playlistId: string;
  /**
   * The access key that authorizes reading the playlist's RSS feed.
   */
  accessKey: string;
}
