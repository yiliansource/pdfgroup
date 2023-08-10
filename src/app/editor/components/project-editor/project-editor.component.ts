import { Component } from '@angular/core';
import { PdfProjectQuery } from '@pdfgroup/editor/store/pdf-project/pdf-project.query';
import { EditorStateQuery } from '@pdfgroup/editor/store/editor-state.query';
import { ActionRunner } from '@pdfgroup/editor/actions/action-runner';
import { AddGroupAction } from '@pdfgroup/editor/actions/add-group.action';
import { PdfProjectPersistor } from '@pdfgroup/editor/store/pdf-project/pdf-project.persistor';

@Component({
    selector: 'pg-project-editor',
    templateUrl: './project-editor.component.html',
    styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent {
    protected readonly name$ = this.pdfProjectQuery.name$;
    protected readonly groups$ = this.pdfProjectQuery.groups$;

    protected readonly canAddGroup$ = this.addGroupAction.canExecute$;

    public constructor(
        private readonly editorQuery: EditorStateQuery,
        private readonly pdfProjectQuery: PdfProjectQuery,
        private readonly actionRunner: ActionRunner,
        private readonly addGroupAction: AddGroupAction,
        private readonly pdfProjectPersistor: PdfProjectPersistor
    ) {}

    protected async addGroup(): Promise<void> {
        await this.actionRunner.run(this.addGroupAction, undefined);
    }

    protected changeName(name: string): void {
        this.pdfProjectPersistor.setName(name);
    }
}
