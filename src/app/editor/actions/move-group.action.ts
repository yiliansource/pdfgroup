import { combineLatest, map, Observable } from 'rxjs';
import { applyTransaction } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';
import { mapIsDefined } from '@pdfgroup/shared/util/operators';
import { EntityAction } from '@pdfgroup/editor/actions/action';

@Injectable()
@NamedLogger('MoveGroupAction')
export class MoveGroupAction implements EntityAction<number, number> {
    public constructor(
        private readonly pdfProjectQuery: PdfProjectQuery,
        private readonly pdfProjectPersistor: PdfProjectPersistor
    ) {}

    public produceCanExecute$(index: number): Observable<boolean> {
        return this.pdfProjectQuery.group(index).pipe(mapIsDefined());
    }

    public produceCanMove$(srcIndex: number, dstIndex: number): Observable<boolean> {
        return combineLatest([this.produceCanExecute$(srcIndex), this.pdfProjectQuery.groups$]).pipe(
            map(([canExecute, allGroups]) => {
                return canExecute && dstIndex >= 0 && dstIndex < allGroups.length;
            })
        );
    }

    public async execute(srcIndex: number, dstIndex: number): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.moveGroup(srcIndex, dstIndex);
        });
    }
}
