import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { PDFDocument } from 'pdf-lib';
import { Observable, of } from 'rxjs';

import { DocumentSourceModel } from '@pdfgroup/document-source/model/document-source.model';
import { DocumentSourcePersistor } from '@pdfgroup/document-source/store/document-source.persistor';
import { Action } from '@pdfgroup/editor/actions/action';
import { VirtualDocumentModel } from '@pdfgroup/editor/models/virtual-document.model';
import { VirtualPageModel } from '@pdfgroup/editor/models/virtual-page.model';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { readFile } from '@pdfgroup/shared/util/files';
import { MM } from '@pdfgroup/shared/util/units';
import { uuid } from '@pdfgroup/shared/util/uuid';

@Injectable()
@NamedLogger('ImportFileAction')
export class ImportFileAction implements Action<undefined, File[]> {
    public produceCanExecute$(): Observable<boolean> {
        return of(true);
    }

    public constructor(
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly pdfProjectPersistor: ProjectPersistor,
        private readonly pdfSourcePersistor: DocumentSourcePersistor
    ) {}

    public async execute(context: undefined, files: File[]): Promise<void> {
        const sources: DocumentSourceModel[] = [];
        const documents: VirtualDocumentModel[] = [];

        for (const file of files) {
            const source: DocumentSourceModel = {
                id: uuid(),
                name: file.name,
                data: await readFile(file),
            };

            const pdfDocument = await PDFDocument.load(source.data);
            const document: VirtualDocumentModel = {
                id: uuid(),
                name: file.name,
                pages: pdfDocument.getPages().map(
                    (page, pageIndex): VirtualPageModel => ({
                        id: uuid(),
                        source: {
                            documentId: source.id,
                            pageIndex: pageIndex,
                        },
                        size: {
                            height: MM(page.getHeight()),
                            width: MM(page.getWidth()),
                        },
                    })
                ),
            };

            sources.push(source);
            documents.push(document);
        }

        applyTransaction(() => {
            sources.forEach((source) => void this.pdfSourcePersistor.add(source));
            documents.forEach((document) => void this.pdfProjectPersistor.addDocument(document));
        });
    }
}
