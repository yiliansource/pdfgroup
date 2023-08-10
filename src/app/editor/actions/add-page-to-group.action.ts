import { Observable } from 'rxjs';
import { applyTransaction } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';
import { PdfPageModel } from '@pdfgroup/pdf/model/pdf-project.model';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';
import { EntityAction } from '@pdfgroup/editor/actions/action';
import { mapIsDefined } from '@pdfgroup/shared/util/operators';

@Injectable()
@NamedLogger('AddPageToGroupAction')
export class AddPageToGroupAction implements EntityAction<number, PdfPageModel> {
    public constructor(
        private readonly pdfProjectQuery: PdfProjectQuery,
        private readonly pdfProjectPersistor: PdfProjectPersistor
    ) {}

    public produceCanExecute$(key: number): Observable<boolean> {
        return this.pdfProjectQuery.group(key).pipe(mapIsDefined());
    }

    public async execute(groupIndex: number, page: PdfPageModel): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.addPage(groupIndex, page);
        });
    }
}
