import { Injectable } from '@angular/core';
import { EditorStateStore } from './editor-state.store';

@Injectable({ providedIn: 'root' })
export class EditorStatePersistor {
    public constructor(private readonly store: EditorStateStore) {}
}
