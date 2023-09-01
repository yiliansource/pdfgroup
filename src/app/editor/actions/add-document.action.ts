import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable, of } from 'rxjs';

import { Action } from '@pdfgroup/editor/actions/action';
import { VirtualDocumentModel } from '@pdfgroup/editor/models/virtual-document.model';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';

@Injectable()
@NamedLogger('AddDocumentAction')
export class AddDocumentAction implements Action<undefined, Partial<VirtualDocumentModel> | undefined> {
    public constructor(private readonly pdfProjectPersistor: ProjectPersistor) {}

    public produceCanExecute$(): Observable<boolean> {
        return of(true);
    }

    public async execute(context: undefined, data?: Partial<VirtualDocumentModel>): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.addDocument(data);
        });
    }
}
