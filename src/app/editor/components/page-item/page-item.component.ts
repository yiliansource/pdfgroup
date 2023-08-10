import { Component, Input } from '@angular/core';
import { PageIndex } from '@pdfgroup/pdf/model/page-index';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';

@Component({
    selector: 'pg-page-item',
    templateUrl: './page-item.component.html',
    styleUrls: ['./page-item.component.scss'],
})
export class PageItemComponent {
    @Input() public set pageIndex(value: PageIndex) {
        this.pageIndex$.next(value);
    }

    protected readonly pageIndex$ = new BehaviorSubject<PageIndex | undefined>(undefined);
    protected readonly page$ = this.pageIndex$.pipe(
        switchMap((index) => (index !== undefined ? this.pdfProjectQuery.page(index) : of(undefined)))
    );

    public constructor(private readonly pdfProjectQuery: PdfProjectQuery) {}
}
