import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';

import { VirtualPageModel } from '@pdfgroup/editor/models/virtual-page.model';
import { PreviewService } from '@pdfgroup/preview/service/preview.service';
import { PagePreviewDataQuery } from '@pdfgroup/preview/stores/page-preview-data.query';
import { getPreviewDataId } from '@pdfgroup/preview/util/preview-data-id';
import { isDefined } from '@pdfgroup/shared/util/is-defined';

@Component({
    selector: 'pg-pdf-page-preview',
    templateUrl: './pdf-page-preview.component.html',
    styleUrls: ['./pdf-page-preview.component.scss'],
})
export class PdfPagePreviewComponent implements OnInit, OnDestroy {
    @Input() public set page(value: VirtualPageModel) {
        this.page$.next(value);
    }

    protected readonly page$ = new BehaviorSubject<VirtualPageModel | undefined>(undefined);
    protected readonly hasPreview$ = new BehaviorSubject<boolean>(false);

    private updatePreviewSubscription: Subscription | undefined;

    constructor(
        private readonly elementRef: ElementRef,
        private readonly previewQuery: PagePreviewDataQuery,
        private readonly previewService: PreviewService
    ) {}

    public ngOnInit(): void {
        this.updatePreviewSubscription = this.page$
            .pipe(
                filter(isDefined),
                tap((page) => {
                    this.previewService.bufferPreviewFor(page.source);
                    this.hasPreview$.next(false);
                }),
                switchMap((page) => this.previewQuery.selectEntity(getPreviewDataId(page.source))),
                filter(isDefined),
                distinctUntilChanged()
            )
            .subscribe((data) => {
                const canvasElement = this.elementRef.nativeElement.querySelector('canvas') as HTMLCanvasElement;
                if (canvasElement === undefined) {
                    throw new Error('Preview canvas was not initialized.');
                }

                const ctx = canvasElement.getContext('2d');
                if (ctx == null) {
                    throw new Error();
                }

                canvasElement.width = data.previewData.width;
                canvasElement.height = data.previewData.height;

                ctx.putImageData(data.previewData, 0, 0);

                this.hasPreview$.next(true);
            });
    }
    public ngOnDestroy() {
        this.updatePreviewSubscription?.unsubscribe();
    }
}
