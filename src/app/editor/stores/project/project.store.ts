import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { ProjectModel } from '@pdfgroup/editor/models/project.model';
import { uuid } from '@pdfgroup/shared/util/uuid';

export function createInitialState(): ProjectModel {
    return {
        id: uuid(),
        name: '',
        documents: [],
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'project' })
export class ProjectStore extends Store<ProjectModel> {
    constructor() {
        super(createInitialState());
    }
}
