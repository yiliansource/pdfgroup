import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable, map } from 'rxjs';

import { Action } from '@pdfgroup/editor/actions/action';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { VirtualPageIndex } from '@pdfgroup/editor/util/virtual-page-index';
import { NamedLogger } from '@pdfgroup/logging/decorators/named-logger';
import { Logger } from '@pdfgroup/logging/impl/logger';
import { isDefined } from '@pdfgroup/shared/util/is-defined';

@Injectable()
@NamedLogger('RemovePageAction')
export class RemovePageAction implements Action<VirtualPageIndex> {
    public constructor(
        private readonly logger: Logger,
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly pdfProjectPersistor: ProjectPersistor
    ) {}

    public produceCanExecute$(index: VirtualPageIndex): Observable<boolean> {
        return this.pdfProjectQuery.page(index).pipe(map(isDefined));
    }

    public async execute(index: VirtualPageIndex): Promise<void> {
        applyTransaction(() => {
            this.pdfProjectPersistor.removePage(index);
        });
    }
}
