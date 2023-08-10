import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';
import { DndDropEvent } from 'ngx-drag-drop';
import { PageIndex } from '@pdfgroup/pdf/model/page-index';
import { PdfPageModel } from '@pdfgroup/pdf/model/pdf-project.model';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';
import { ActionRunner } from '@pdfgroup/editor/actions/action-runner';
import { MoveGroupAction } from '@pdfgroup/editor/actions/move-group.action';
import { RemoveGroupAction } from '@pdfgroup/editor/actions/remove-group.action';
import { MovePageAction } from '@pdfgroup/editor/actions/move-page.action';

@Component({
    selector: 'pg-group-editor',
    templateUrl: './group-editor.component.html',
    styleUrls: ['./group-editor.component.scss'],
})
export class GroupEditorComponent {
    @Input() public set groupIndex(value: number) {
        this.groupIndex$.next(value);
    }

    protected readonly groupIndex$ = new BehaviorSubject(-1);
    protected readonly group$ = this.groupIndex$.pipe(
        switchMap((groupIndex) => this.pdfProjectQuery.group(groupIndex))
    );

    protected readonly name$ = this.group$.pipe(map((group) => group?.name ?? ''));
    protected readonly pages$ = this.group$.pipe(map((group) => group?.pages ?? []));
    protected readonly pageIndices$ = combineLatest([this.groupIndex$, this.pages$]).pipe(
        map<[number, PdfPageModel[]], PageIndex[]>(([groupIndex, pages]) =>
            pages.map((page, pageIndexInGroup) => ({
                groupIndex,
                pageIndexInGroup,
            }))
        )
    );

    protected readonly canRemoveGroup$ = this.groupIndex$.pipe(
        switchMap((groupIndex) => this.removeGroupAction.produceCanExecute$(groupIndex))
    );
    protected readonly canMoveGroupUp$ = this.groupIndex$.pipe(
        switchMap((groupIndex) => this.moveGroupAction.produceCanMove$(groupIndex, groupIndex - 1))
    );
    protected readonly canMoveGroupDown$ = this.groupIndex$.pipe(
        switchMap((groupIndex) => this.moveGroupAction.produceCanMove$(groupIndex, groupIndex + 1))
    );

    public constructor(
        private readonly pdfProjectQuery: PdfProjectQuery,
        private readonly pdfProjectPersistor: PdfProjectPersistor,
        private readonly removeGroupAction: RemoveGroupAction,
        private readonly movePageAction: MovePageAction,
        private readonly moveGroupAction: MoveGroupAction,
        private readonly actionRunner: ActionRunner
    ) {}

    protected async onDrop(event: DndDropEvent): Promise<void> {
        console.log(event);

        if (event.type === 'PAGE') {
            if (event.index === undefined) {
                return;
            }

            await this.actionRunner.runEntity(this.movePageAction, event.data as PageIndex, {
                groupIndex: this.groupIndex$.getValue(),
                pageIndexInGroup: event.index,
            });
        }
    }

    protected async removeGroup(): Promise<void> {
        await this.actionRunner.runEntity(this.removeGroupAction, this.groupIndex$.getValue(), undefined);
    }

    protected async moveGroupBy(delta: number): Promise<void> {
        const groupIndex = this.groupIndex$.getValue();
        await this.actionRunner.runEntity(this.moveGroupAction, groupIndex, groupIndex + delta);
    }

    protected changeName(name: string): void {
        this.pdfProjectPersistor.setGroupName(this.groupIndex$.getValue(), name);
    }
}
