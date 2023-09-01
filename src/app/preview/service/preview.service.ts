import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import { filter, firstValueFrom } from 'rxjs';

import { DocumentSourceQuery } from '@pdfgroup/document-source/store/document-source.query';
import { VirtualPageSourceIndex } from '@pdfgroup/editor/util/virtual-page-source.index';
import { PagePreviewDataModel } from '@pdfgroup/preview/model/page-preview-data.model';
import { PagePreviewDataPersistor } from '@pdfgroup/preview/stores/page-preview-data.persistor';
import { PagePreviewDataQuery } from '@pdfgroup/preview/stores/page-preview-data.query';
import { getPreviewDataId } from '@pdfgroup/preview/util/preview-data-id';
import { isDefined } from '@pdfgroup/shared/util/is-defined';

@Injectable({ providedIn: 'root' })
export class PreviewService {
    constructor(
        private readonly sourceQuery: DocumentSourceQuery,
        private readonly previewDataQuery: PagePreviewDataQuery,
        private readonly previewDataPersistor: PagePreviewDataPersistor
    ) {}

    public async bufferPreviewFor(index: VirtualPageSourceIndex): Promise<void> {
        const previewDataId = getPreviewDataId(index);
        if (this.previewDataQuery.hasEntity(previewDataId)) {
            return;
        }

        const source = await firstValueFrom(this.sourceQuery.selectEntity(index.documentId).pipe(filter(isDefined)));
        const pdfjsDocument = await PDFJS.getDocument(source.data.slice(0)).promise;
        const pdfjsPage = await pdfjsDocument.getPage(index.pageIndex + 1); // pdf-js pages are 1-indexed
        const viewport = pdfjsPage.getViewport({ scale: 1 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (ctx === null) {
            throw new Error('The 2D canvas context could not be retrieved.');
        }

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };

        await pdfjsPage.render(renderContext).promise;

        const cacheData = ctx.getImageData(0, 0, viewport.width, viewport.height);
        const previewData: PagePreviewDataModel = {
            id: previewDataId,
            previewData: cacheData,
        };

        applyTransaction(() => {
            this.previewDataPersistor.add(previewData);
        });

        await pdfjsDocument.destroy();
    }
}
