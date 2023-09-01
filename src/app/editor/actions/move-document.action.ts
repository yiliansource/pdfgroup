import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable, combineLatest, map } from 'rxjs';

import { Action } from '@pdfgroup/editor/actions/action';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { VirtualDocumentIndex } from '@pdfgroup/editor/util/virtual-document-index';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { isDefined } from '@pdfgroup/shared/util/is-defined';

@Injectable()
@NamedLogger('MoveDocumentAction')
export class MoveDocumentAction implements Action<VirtualDocumentIndex, VirtualDocumentIndex> {
    public constructor(
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly pdfProjectPersistor: ProjectPersistor
    ) {}

    public produceCanExecute$(sourceIndex: VirtualDocumentIndex): Observable<boolean> {
        return this.pdfProjectQuery.document(sourceIndex).pipe(map(isDefined));
    }

    public produceCanMove$(
        sourceIndex: VirtualDocumentIndex,
        destinationIndex: VirtualDocumentIndex
    ): Observable<boolean> {
        return combineLatest([this.produceCanExecute$(sourceIndex), this.pdfProjectQuery.documents$]).pipe(
            map(([canExecute, allDocuments]) => {
                return canExecute && destinationIndex >= 0 && destinationIndex < allDocuments.length;
            })
        );
    }

    public async execute(sourceIndex: VirtualDocumentIndex, destinationIndex: VirtualDocumentIndex): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.moveDocument(sourceIndex, destinationIndex);
        });
    }
}
