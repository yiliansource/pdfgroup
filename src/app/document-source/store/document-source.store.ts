import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { DocumentSourceModel } from '@pdfgroup/document-source/model/document-source.model';

export type DocumentSourcesState = EntityState<DocumentSourceModel, string>;

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'document-source', deepFreezeFn: (x) => x })
export class DocumentSourceStore extends EntityStore<DocumentSourcesState> {
    constructor() {
        super();
    }
}
