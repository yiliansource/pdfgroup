import { map, Observable } from 'rxjs';
import { applyTransaction } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';
import { PageIndex } from '@pdfgroup/pdf/model/page-index';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';
import { EntityAction } from '@pdfgroup/editor/actions/action';
import { mapIsDefined } from '@pdfgroup/shared/util/operators';

@Injectable()
@NamedLogger('DeletePageAction')
export class DeletePageAction implements EntityAction<PageIndex> {
    public constructor(
        private readonly pdfProjectQuery: PdfProjectQuery,
        private readonly pdfProjectPersistor: PdfProjectPersistor
    ) {}

    public produceCanExecute$(index: PageIndex): Observable<boolean> {
        return this.pdfProjectQuery.page(index).pipe(mapIsDefined());
    }

    public async execute(index: PageIndex): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.removePage(index);
        });
    }
}
