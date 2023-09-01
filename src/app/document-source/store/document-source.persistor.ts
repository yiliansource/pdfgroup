import { Injectable } from '@angular/core';

import { DocumentSourceModel } from '@pdfgroup/document-source/model/document-source.model';
import { DocumentSourceStore } from '@pdfgroup/document-source/store/document-source.store';

@Injectable({ providedIn: 'root' })
export class DocumentSourcePersistor {
    public constructor(private readonly store: DocumentSourceStore) {}

    public add(data: DocumentSourceModel): void {
        this.store.add(data);
    }
    public remove(id: string): void {
        this.store.remove(id);
    }
}
