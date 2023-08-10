import { of } from 'rxjs';
import { applyTransaction } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';
import { Action } from '@pdfgroup/editor/actions/action';

@Injectable()
@NamedLogger('AddGroupAction')
export class AddGroupAction implements Action<void> {
    public canExecute$ = of(true);

    public constructor(private readonly pdfProjectPersistor: PdfProjectPersistor) {}

    public async execute(): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.addGroup();
        });
    }
}
