export interface FirestoreEmulatorConfig {
  host: string;
  port: number;
}

export interface FirestoreClientConfig {
  projectId: string;

  /**
   * Database identifier, as created by terraform.
   */
  databaseId: string;

  /**
   * Sends the client to a local emulator instead of Google Cloud.
   */
  emulator?: FirestoreEmulatorConfig;
}
