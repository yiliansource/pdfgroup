import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';

import { RemovePageAction } from '@pdfgroup/editor/actions/remove-page.action';
import { PAGE_HEIGHT } from '@pdfgroup/editor/editor.constants';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { VirtualPageIndex } from '@pdfgroup/editor/util/virtual-page-index';
import { getAspectRatio } from '@pdfgroup/shared/util/dimensions/aspect-ratio';
import { PX } from '@pdfgroup/shared/util/units';

@Component({
    selector: 'pg-page-item',
    templateUrl: './page-item.component.html',
    styleUrls: ['./page-item.component.scss'],
})
export class PageItemComponent {
    @Input() public set pageIndex(value: VirtualPageIndex) {
        this.pageIndex$.next(value);
    }

    protected readonly pageIndex$ = new BehaviorSubject<VirtualPageIndex | undefined>(undefined);
    protected readonly page$ = this.pageIndex$.pipe(
        switchMap((index) => (index !== undefined ? this.pdfProjectQuery.page(index) : of(undefined)))
    );

    protected readonly pageHeight$ = of(PAGE_HEIGHT);
    protected readonly pageWidth$ = combineLatest([this.page$, this.pageHeight$]).pipe(
        map(([page, pageHeight]) => PX(pageHeight * (page !== undefined ? getAspectRatio(page.size) : 1)))
    );

    public constructor(
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly removePageAction: RemovePageAction
    ) {}
}
