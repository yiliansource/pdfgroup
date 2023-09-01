import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable, map } from 'rxjs';

import { Action } from '@pdfgroup/editor/actions/action';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { VirtualPageIndex } from '@pdfgroup/editor/util/virtual-page-index';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { isDefined } from '@pdfgroup/shared/util/is-defined';

@Injectable()
@NamedLogger('MovePageAction')
export class MovePageAction implements Action<VirtualPageIndex, VirtualPageIndex> {
    public constructor(
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly pdfProjectPersistor: ProjectPersistor
    ) {}

    public produceCanExecute$(sourceIndex: VirtualPageIndex): Observable<boolean> {
        return this.pdfProjectQuery.page(sourceIndex).pipe(map(isDefined));
    }

    public async execute(sourceIndex: VirtualPageIndex, destinationIndex: VirtualPageIndex): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.movePage(sourceIndex, destinationIndex);
        });
    }
}
