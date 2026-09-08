import { KerkdienstgemistServiceRetriever } from '#kerkdienstgemist/kerkdienstgemist-service-retriever';
import { KdgServiceRetrieverConfig } from '#kerkdienstgemist/models/service-retriever-config';
import { ServiceRetriever } from '#service-retriever';

/**
 * Each retriever owns its config; the factory routes on `type` only, staying agnostic of the rest.
 */
export type ServiceRetrieverConfig = KdgServiceRetrieverConfig;

export function getServiceRetriever(config: ServiceRetrieverConfig): ServiceRetriever {
  switch (config.type) {
    case 'kerkdienstgemist':
      return new KerkdienstgemistServiceRetriever(config);
  }
}
