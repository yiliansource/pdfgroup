import { Observable } from 'rxjs';
import { applyTransaction } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';
import { mapIsDefined } from '@pdfgroup/shared/util/operators';
import { EntityAction } from '@pdfgroup/editor/actions/action';

@Injectable()
@NamedLogger('RemoveGroupAction')
export class RemoveGroupAction implements EntityAction<number> {
    public constructor(
        private readonly pdfProjectQuery: PdfProjectQuery,
        private readonly pdfProjectPersistor: PdfProjectPersistor
    ) {}

    public produceCanExecute$(index: number): Observable<boolean> {
        return this.pdfProjectQuery.group(index).pipe(mapIsDefined());
    }

    public async execute(index: number): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.removeGroup(index);
        });
    }
}
