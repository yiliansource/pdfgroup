import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { PagePreviewDataModel } from '@pdfgroup/preview/model/page-preview-data.model';

export type PagePreviewDataState = EntityState<PagePreviewDataModel, string>;

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'page-previews', deepFreezeFn: (x) => x })
export class PagePreviewDataStore extends EntityStore<PagePreviewDataState> {
    constructor() {
        super();
    }
}
