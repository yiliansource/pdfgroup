import { Component, Input } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';

import { MoveDocumentAction } from '@pdfgroup/editor/actions/move-document.action';
import { MovePageAction } from '@pdfgroup/editor/actions/move-page.action';
import { RemoveDocumentAction } from '@pdfgroup/editor/actions/remove-document.action';
import { RemovePageAction } from '@pdfgroup/editor/actions/remove-page.action';
import { DndEventType } from '@pdfgroup/editor/dnd/dnd-event-type';
import { isDndPageDropEvent } from '@pdfgroup/editor/dnd/dnd-page-drop-event';
import { PAGE_HEIGHT } from '@pdfgroup/editor/editor.constants';
import { VirtualPageModel } from '@pdfgroup/editor/models/virtual-page.model';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { VirtualPageIndex } from '@pdfgroup/editor/util/virtual-page-index';

interface PageCollectionItem {
    index: VirtualPageIndex;
    page: VirtualPageModel;
}

@Component({
    selector: 'pg-document-editor',
    templateUrl: './document-editor.component.html',
    styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent {
    @Input() public set documentIndex(value: number) {
        this.documentIndex$.next(value);
    }

    protected readonly documentIndex$ = new BehaviorSubject(-1);
    protected readonly document$ = this.documentIndex$.pipe(
        switchMap((groupIndex) => this.pdfProjectQuery.document(groupIndex))
    );

    protected readonly name$ = this.document$.pipe(map((document) => document?.name ?? ''));
    protected readonly pages$ = this.document$.pipe(map((document) => document?.pages ?? []));
    protected readonly pageCollection$ = combineLatest([this.documentIndex$, this.pages$]).pipe(
        map(([documentIndex, pages]) =>
            pages.map<PageCollectionItem>((page, pageIndexInGroup) => ({
                index: {
                    documentIndex: documentIndex,
                    pageIndexInDocument: pageIndexInGroup,
                },
                page: page,
            }))
        )
    );

    protected readonly canRemoveDocument$ = this.documentIndex$.pipe(
        switchMap((documentIndex) => this.removeGroupAction.produceCanExecute$(documentIndex))
    );
    protected readonly canMoveDocumentUp$ = this.documentIndex$.pipe(
        switchMap((documentIndex) => this.moveGroupAction.produceCanMove$(documentIndex, documentIndex - 1))
    );
    protected readonly canMoveDocumentDown = this.documentIndex$.pipe(
        switchMap((documentIndex) => this.moveGroupAction.produceCanMove$(documentIndex, documentIndex + 1))
    );

    protected readonly pageListHeight$ = of(PAGE_HEIGHT);

    protected readonly allowedDropTypes = [DndEventType.Page];
    protected readonly pageDropType = DndEventType.Page;

    public constructor(
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly pdfProjectPersistor: ProjectPersistor,
        private readonly removeGroupAction: RemoveDocumentAction,
        private readonly moveGroupAction: MoveDocumentAction,
        private readonly movePageAction: MovePageAction,
        private readonly deletePageAction: RemovePageAction
    ) {}

    protected async onDrop(event: DndDropEvent): Promise<void> {
        if (isDndPageDropEvent(event)) {
            if (event.index === undefined) {
                return;
            }

            await this.movePageAction.execute(event.data, {
                documentIndex: this.documentIndex$.getValue(),
                pageIndexInDocument: event.index,
            });
        }
    }

    protected async removeGroup(): Promise<void> {
        await this.removeGroupAction.execute(this.documentIndex$.getValue());
    }

    protected async moveDocumentBy(delta: number): Promise<void> {
        const documentIndex = this.documentIndex$.getValue();
        await this.moveGroupAction.execute(documentIndex, documentIndex + delta);
    }

    protected async deletePage(pageIndex: VirtualPageIndex): Promise<void> {
        await this.deletePageAction.execute(pageIndex);
    }

    protected changeName(name: string): void {
        this.pdfProjectPersistor.setDocumentName(this.documentIndex$.getValue(), name);
    }

    protected trackPageBy(index: number, item: PageCollectionItem): string {
        return item.page.id;
    }
}
