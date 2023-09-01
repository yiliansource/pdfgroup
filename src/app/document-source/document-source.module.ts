import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DocumentSourcePersistor } from '@pdfgroup/document-source/store/document-source.persistor';
import { DocumentSourceQuery } from '@pdfgroup/document-source/store/document-source.query';
import { DocumentSourceStore } from '@pdfgroup/document-source/store/document-source.store';

@NgModule({
    imports: [CommonModule],
    providers: [DocumentSourcePersistor, DocumentSourceQuery, DocumentSourceStore],
})
export class DocumentSourceModule {}
