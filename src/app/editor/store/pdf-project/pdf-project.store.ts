import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PdfProjectModel } from '@pdfgroup/pdf/model/pdf-project.model';

export type PdfProjectState = PdfProjectModel;

export function createInitialState(): PdfProjectState {
    return {
        name: 'test project',
        groups: [
            {
                name: 'test group',
                pages: [
                    {
                        data: 'x',
                    },
                    {
                        data: 'y',
                    },
                ],
            },
        ],
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'editor' })
export class PdfProjectStore extends Store<PdfProjectState> {
    constructor() {
        super(createInitialState());
    }
}
