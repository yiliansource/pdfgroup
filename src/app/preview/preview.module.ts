import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { DocumentSourceModule } from '@pdfgroup/document-source/document-source.module';
import { PreviewService } from '@pdfgroup/preview/service/preview.service';
import { PagePreviewDataPersistor } from '@pdfgroup/preview/stores/page-preview-data.persistor';
import { PagePreviewDataQuery } from '@pdfgroup/preview/stores/page-preview-data.query';
import { PagePreviewDataStore } from '@pdfgroup/preview/stores/page-preview-data.store';

import { PdfPagePreviewComponent } from './components/page-preview/pdf-page-preview.component';

@NgModule({
    imports: [CommonModule, DocumentSourceModule, NgxSkeletonLoaderModule],
    providers: [PreviewService, PagePreviewDataQuery, PagePreviewDataPersistor, PagePreviewDataStore],
    declarations: [PdfPagePreviewComponent],
    exports: [PdfPagePreviewComponent],
})
export class PreviewModule {}
