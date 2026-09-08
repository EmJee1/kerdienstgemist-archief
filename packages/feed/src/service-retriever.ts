import { Result } from 'neverthrow';

import { Service } from '#models/service';

export type ServiceRetrieverError =
  | { kind: 'network'; cause: unknown }
  | { kind: 'httpStatus'; status: number; responseBody?: string }
  | { kind: 'decode'; cause: unknown }
  | { kind: 'parse'; cause: unknown };

export interface ServiceRetriever {
  getServices(limit: number): Promise<Result<Service[], ServiceRetrieverError>>;
}
