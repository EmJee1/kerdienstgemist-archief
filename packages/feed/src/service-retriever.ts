import { ResultAsync } from 'neverthrow';

import { KerkdienstgemistServiceRetriever } from '#kerkdienstgemist/kerkdienstgemist-service-retriever';
import { Service } from '#models/service';

export type ServiceRetrieverError =
  | { kind: 'network'; cause: unknown }
  | { kind: 'httpStatus'; status: number; responseBody?: string }
  | { kind: 'decode'; cause: unknown }
  | { kind: 'parse'; cause: unknown };

export abstract class ServiceRetriever {
  public abstract getServices(
    limit: number,
  ): Promise<ResultAsync<Service[], ServiceRetrieverError>>;
}

type ServiceRetrieverType = 'kerkdienstgemist';
export function getServiceRetriever(type: ServiceRetrieverType) {
  switch (type) {
    case 'kerkdienstgemist':
      return new KerkdienstgemistServiceRetriever();
  }
}
