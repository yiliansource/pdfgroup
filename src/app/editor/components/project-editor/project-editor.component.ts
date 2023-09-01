import { Component } from '@angular/core';
import fileDialog from 'file-dialog';
import { DndDropEvent } from 'ngx-drag-drop';
import { firstValueFrom, map } from 'rxjs';

import { AddDocumentAction } from '@pdfgroup/editor/actions/add-document.action';
import { ImportFileAction } from '@pdfgroup/editor/actions/import-file.action';
import { MovePageAction } from '@pdfgroup/editor/actions/move-page.action';
import { isDndPageDropEvent } from '@pdfgroup/editor/dnd/dnd-page-drop-event';
import { VirtualDocumentModel } from '@pdfgroup/editor/models/virtual-document.model';
import { ProjectValidationQuery, ValidationSeverity } from '@pdfgroup/editor/stores/project/project-validation.query';
import { ProjectPersistor } from '@pdfgroup/editor/stores/project/project.persistor';
import { ProjectQuery } from '@pdfgroup/editor/stores/project/project.query';
import { VirtualDocumentIndex } from '@pdfgroup/editor/util/virtual-document-index';

interface DocumentCollectionItem {
    index: VirtualDocumentIndex;
    document: VirtualDocumentModel;
}

@Component({
    selector: 'pg-project-editor',
    templateUrl: './project-editor.component.html',
    styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent {
    protected readonly name$ = this.pdfProjectQuery.name$;
    protected readonly documents$ = this.pdfProjectQuery.documents$;
    protected readonly documentCollection$ = this.documents$.pipe(
        map((documents) =>
            documents.map<DocumentCollectionItem>((document, documentIndex) => ({
                index: documentIndex,
                document: document,
            }))
        )
    );

    protected readonly canAddDocument$ = this.addDocumentAction.produceCanExecute$();

    protected readonly exportBadgeContent$ = this.projectValidationQuery.validations$.pipe(
        map((validations) => {
            const warnings = validations.filter((validation) => validation.severity === ValidationSeverity.WARNING);
            return warnings.length > 0 ? warnings.length : undefined;
        })
    );

    public constructor(
        private readonly projectValidationQuery: ProjectValidationQuery,
        private readonly pdfProjectQuery: ProjectQuery,
        private readonly addDocumentAction: AddDocumentAction,
        private readonly pdfProjectPersistor: ProjectPersistor,
        private readonly importFileAction: ImportFileAction,
        private readonly movePageAction: MovePageAction
    ) {}

    protected async addDocument(): Promise<void> {
        await this.addDocumentAction.execute(undefined);
    }

    protected async dropIntoNewGroup(event: DndDropEvent): Promise<void> {
        if (isDndPageDropEvent(event)) {
            const groupCount = (await firstValueFrom(this.pdfProjectQuery.documents$)).length;

            await this.addDocumentAction.execute(undefined);
            await this.movePageAction.execute(event.data, {
                documentIndex: groupCount,
                pageIndexInDocument: 0,
            });
        }
    }

    protected async changeName(name: string): Promise<void> {
        this.pdfProjectPersistor.setProjectName(name);
    }

    protected async handleExport(): Promise<void> {
        // TODO
    }

    protected async handleImport(): Promise<void> {
        const files = await fileDialog({
            multiple: true,
            accept: 'application/pdf',
        });

        await this.importFileAction.execute(undefined, Array.from(files));
    }

    protected trackDocumentBy(index: number, item: DocumentCollectionItem): string {
        return item.document.id;
    }
}
