import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { PagePreviewDataState, PagePreviewDataStore } from '@pdfgroup/preview/stores/page-preview-data.store';

@Injectable({ providedIn: 'root' })
export class PagePreviewDataQuery extends QueryEntity<PagePreviewDataState> {
    public constructor(protected override readonly store: PagePreviewDataStore) {
        super(store);
    }
}
