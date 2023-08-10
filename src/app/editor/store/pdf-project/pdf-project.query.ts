import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { PdfProjectState, PdfProjectStore } from '@pdfgroup/editor/store/pdf-project/pdf-project.store';
import { map, Observable } from 'rxjs';
import { PageIndex } from '@pdfgroup/pdf/model/page-index';
import { PdfGroupModel, PdfPageModel } from '@pdfgroup/pdf/model/pdf-project.model';

@Injectable({ providedIn: 'root' })
export class PdfProjectQuery extends Query<PdfProjectState> {
    public name$ = this.select('name');
    public groups$ = this.select('groups');

    public constructor(protected override store: PdfProjectStore) {
        super(store);
    }

    public group(index: number): Observable<PdfGroupModel | undefined> {
        return this.groups$.pipe(map((groups) => groups[index]));
    }

    public page(index: PageIndex): Observable<PdfPageModel | undefined> {
        return this.group(index.groupIndex).pipe(
            map((group) => {
                if (group === undefined) {
                    return undefined;
                }
                return group.pages[index.pageIndexInGroup];
            })
        );
    }
}
