import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface EditorState {}

export function createInitialState(): EditorState {
    return {};
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'editor' })
export class EditorStateStore extends Store<EditorState> {
    constructor() {
        super(createInitialState());
    }
}
