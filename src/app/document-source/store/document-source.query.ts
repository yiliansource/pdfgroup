import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { DocumentSourceStore, DocumentSourcesState } from '@pdfgroup/document-source/store/document-source.store';

@Injectable({ providedIn: 'root' })
export class DocumentSourceQuery extends QueryEntity<DocumentSourcesState> {
    public constructor(protected override readonly store: DocumentSourceStore) {
        super(store);
    }
}
