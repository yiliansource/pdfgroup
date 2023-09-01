import { Injectable } from '@angular/core';

import { PagePreviewDataModel } from '@pdfgroup/preview/model/page-preview-data.model';
import { PagePreviewDataStore } from '@pdfgroup/preview/stores/page-preview-data.store';

@Injectable({ providedIn: 'root' })
export class PagePreviewDataPersistor {
    public constructor(private readonly store: PagePreviewDataStore) {}

    public add(data: PagePreviewDataModel): void {
        this.store.add(data);
    }
}
