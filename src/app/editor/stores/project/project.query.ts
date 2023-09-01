import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable, map } from 'rxjs';

import { ProjectModel } from '@pdfgroup/editor/models/project.model';
import { VirtualDocumentModel } from '@pdfgroup/editor/models/virtual-document.model';
import { VirtualPageModel } from '@pdfgroup/editor/models/virtual-page.model';
import { ProjectStore } from '@pdfgroup/editor/stores/project/project.store';
import { VirtualPageIndex } from '@pdfgroup/editor/util/virtual-page-index';

@Injectable({ providedIn: 'root' })
export class ProjectQuery extends Query<ProjectModel> {
    public readonly name$ = this.select('name');
    public readonly documents$ = this.select('documents');

    public readonly pages$ = this.documents$.pipe(map((groups) => groups.flatMap((group) => group.pages)));

    public constructor(protected override store: ProjectStore) {
        super(store);
    }

    public document(index: number): Observable<VirtualDocumentModel | undefined> {
        return this.documents$.pipe(map((groups) => groups[index]));
    }

    public page(index: VirtualPageIndex): Observable<VirtualPageModel | undefined> {
        return this.document(index.documentIndex).pipe(
            map((document) => {
                if (document === undefined) {
                    return undefined;
                }
                return document.pages[index.pageIndexInDocument];
            })
        );
    }
}
