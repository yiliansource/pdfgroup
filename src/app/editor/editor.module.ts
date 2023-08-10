import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ngx-drag-drop';
import { FormsModule } from '@angular/forms';
import { LoggingModule } from '@pdfgroup/logging/logging.module';
import { EditorStatePersistor } from '@pdfgroup/editor/store/editor-state.persistor';
import { EditorStateQuery } from '@pdfgroup/editor/store/editor-state.query';
import { EditorStateStore } from '@pdfgroup/editor/store/editor-state.store';
import { AddGroupAction } from '@pdfgroup/editor/actions/add-group.action';
import { AddPageToGroupAction } from '@pdfgroup/editor/actions/add-page-to-group.action';
import { DeletePageAction } from '@pdfgroup/editor/actions/delete-page.action';
import { MovePageAction } from '@pdfgroup/editor/actions/move-page.action';
import { MoveGroupAction } from '@pdfgroup/editor/actions/move-group.action';
import { RemoveGroupAction } from '@pdfgroup/editor/actions/remove-group.action';
import { ProjectEditorComponent } from '@pdfgroup/editor/components/project-editor/project-editor.component';
import { GroupEditorComponent } from '@pdfgroup/editor/components/group-editor/group-editor.component';
import { PageItemComponent } from '@pdfgroup/editor/components/page-item/page-item.component';
import { ComponentsModule } from '@pdfgroup/core/components/components.module';

@NgModule({
    imports: [CommonModule, ComponentsModule, FormsModule, DndModule, LoggingModule],
    providers: [
        EditorStatePersistor,
        EditorStateQuery,
        EditorStateStore,
        AddGroupAction,
        AddPageToGroupAction,
        DeletePageAction,
        MovePageAction,
        MoveGroupAction,
        RemoveGroupAction,
    ],
    declarations: [ProjectEditorComponent, GroupEditorComponent, PageItemComponent],
    exports: [ProjectEditorComponent],
})
export class EditorModule {}
