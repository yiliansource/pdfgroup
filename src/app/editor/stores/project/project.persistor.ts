import { Injectable } from '@angular/core';
import { arrayMoveMutable } from 'array-move';

import { VirtualDocumentModel } from '@pdfgroup/editor/models/virtual-document.model';
import { ProjectStore } from '@pdfgroup/editor/stores/project/project.store';
import { VirtualDocumentIndex } from '@pdfgroup/editor/util/virtual-document-index';
import { VirtualPageIndex } from '@pdfgroup/editor/util/virtual-page-index';
import { uuid } from '@pdfgroup/shared/util/uuid';

@Injectable({ providedIn: 'root' })
export class ProjectPersistor {
    public constructor(private readonly store: ProjectStore) {}

    public setProjectName(name: string): void {
        this.store.update((project) => {
            project.name = name;
        });
    }
    public setDocumentName(documentIndex: VirtualDocumentIndex, name: string) {
        this.store.update((project) => {
            project.documents[documentIndex].name = name;
        });
    }

    public addDocument(data?: Partial<VirtualDocumentModel>): void {
        this.store.update((project) => {
            project.documents.push({
                id: uuid(),
                pages: [],
                name: '',
                ...data,
            });
        });
    }
    public removeDocument(documentIndex: VirtualDocumentIndex): void {
        this.store.update((project) => {
            project.documents.splice(documentIndex, 1);
        });
    }
    public moveDocument(
        sourceDocumentIndex: VirtualDocumentIndex,
        destinationDocumentIndex: VirtualDocumentIndex
    ): void {
        this.store.update((project) => {
            arrayMoveMutable(project.documents, sourceDocumentIndex, destinationDocumentIndex);
        });
    }

    public removePage(pageIndex: VirtualPageIndex): void {
        this.store.update((project) => {
            project.documents[pageIndex.documentIndex].pages.splice(pageIndex.pageIndexInDocument, 1);
        });
    }
    public movePage(sourcePageIndex: VirtualPageIndex, destinationPageIndex: VirtualPageIndex): void {
        this.store.update((project) => {
            if (sourcePageIndex.documentIndex === destinationPageIndex.documentIndex) {
                const document = project.documents[sourcePageIndex.documentIndex];
                arrayMoveMutable(
                    document.pages,
                    sourcePageIndex.pageIndexInDocument,
                    destinationPageIndex.pageIndexInDocument
                );
            } else {
                const [page] = project.documents[sourcePageIndex.documentIndex].pages.splice(
                    sourcePageIndex.pageIndexInDocument,
                    1
                );
                project.documents[destinationPageIndex.documentIndex].pages.splice(
                    destinationPageIndex.pageIndexInDocument,
                    0,
                    page
                );
            }
        });
    }
}
