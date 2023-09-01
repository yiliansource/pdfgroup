import { CdkMenuModule } from '@angular/cdk/menu';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DndModule } from 'ngx-drag-drop';

import { AddDocumentAction } from '@pdfgroup/editor/actions/add-document.action';
import { ImportFileAction } from '@pdfgroup/editor/actions/import-file.action';
import { MoveDocumentAction } from '@pdfgroup/editor/actions/move-document.action';
import { MovePageAction } from '@pdfgroup/editor/actions/move-page.action';
import { RemoveDocumentAction } from '@pdfgroup/editor/actions/remove-document.action';
import { RemovePageAction } from '@pdfgroup/editor/actions/remove-page.action';
import { DocumentEditorComponent } from '@pdfgroup/editor/components/document-editor/document-editor.component';
import { PageItemComponent } from '@pdfgroup/editor/components/page-item/page-item.component';
import { ProjectEditorComponent } from '@pdfgroup/editor/components/project-editor/project-editor.component';
import { LoggingModule } from '@pdfgroup/logging/logging.module';
import { PreviewModule } from '@pdfgroup/preview/preview.module';

@NgModule({
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatBadgeModule,
        MatButtonModule,
        MatIconModule,
        CdkMenuModule,
        FormsModule,
        DndModule,
        LoggingModule,
        PreviewModule,
    ],
    providers: [
        ImportFileAction,
        AddDocumentAction,
        RemovePageAction,
        MovePageAction,
        MoveDocumentAction,
        RemoveDocumentAction,
    ],
    declarations: [ProjectEditorComponent, DocumentEditorComponent, PageItemComponent],
    exports: [ProjectEditorComponent],
})
export class EditorModule {}
