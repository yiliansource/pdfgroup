import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable, map } from 'rxjs';

import { Action } from '@pdfgroup/editor/actions/action';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { VirtualDocumentIndex } from '@pdfgroup/editor/util/virtual-document-index';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { isDefined } from '@pdfgroup/shared/util/is-defined';

@Injectable()
@NamedLogger('RemoveDocumentAction')
export class RemoveDocumentAction implements Action<VirtualDocumentIndex> {
    public constructor(
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly pdfProjectPersistor: ProjectPersistor
    ) {}

    public produceCanExecute$(index: VirtualDocumentIndex): Observable<boolean> {
        return this.pdfProjectQuery.document(index).pipe(map(isDefined));
    }

    public async execute(index: VirtualDocumentIndex): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.removeDocument(index);
        });
    }
}
