import { Observable } from 'rxjs';
import { applyTransaction } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';
import { PageIndex } from '@pdfgroup/pdf/model/page-index';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';
import { mapIsDefined } from '@pdfgroup/shared/util/operators';
import { EntityAction } from '@pdfgroup/editor/actions/action';

@Injectable()
@NamedLogger('MovePageAction')
export class MovePageAction implements EntityAction<PageIndex, PageIndex> {
    public constructor(
        private readonly pdfProjectQuery: PdfProjectQuery,
        private readonly pdfProjectPersistor: PdfProjectPersistor
    ) {}

    public produceCanExecute$(index: PageIndex): Observable<boolean> {
        return this.pdfProjectQuery.page(index).pipe(mapIsDefined());
    }

    public async execute(srcIndex: PageIndex, dstIndex: PageIndex): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.movePage(srcIndex, dstIndex);
        });
    }
}
