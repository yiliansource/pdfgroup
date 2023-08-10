import { Injectable } from '@angular/core';
import { EditorState, EditorStateStore } from './editor-state.store';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class EditorStateQuery extends Query<EditorState> {
    public constructor(protected override store: EditorStateStore) {
        super(store);
    }
}
