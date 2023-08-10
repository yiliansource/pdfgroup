import { Injectable } from '@angular/core';
import { PdfProjectStore } from '@pdfgroup/editor/store/pdf-project/pdf-project.store';
import { PdfPageModel } from '@pdfgroup/pdf/model/pdf-project.model';
import { PageIndex } from '@pdfgroup/pdf/model/page-index';
import { arrayMoveMutable } from 'array-move';

@Injectable({ providedIn: 'root' })
export class PdfProjectPersistor {
    public constructor(private readonly store: PdfProjectStore) {}

    public setName(name: string): void {
        this.store.update((project) => {
            project.name = name;
        });
    }
    public setGroupName(groupIndex: number, name: string) {
        this.store.update((project) => {
            project.groups[groupIndex].name = name;
        });
    }

    public addGroup(): void {
        this.store.update((project) => {
            project.groups.push({
                pages: [],
                name: 'New Group',
            });
        });
    }
    public removeGroup(index: number): void {
        this.store.update((project) => {
            project.groups.splice(index, 1);
        });
    }
    public moveGroup(srcIndex: number, dstIndex: number): void {
        this.store.update((project) => {
            arrayMoveMutable(project.groups, srcIndex, dstIndex);
        });
    }

    public addPage(groupIndex: number, page: PdfPageModel): void {
        this.addPages(groupIndex, [page]);
    }
    public addPages(groupIndex: number, pages: PdfPageModel[]): void {
        this.store.update((project) => {
            project.groups[groupIndex].pages.push(...pages);
        });
    }
    public removePage(pageIndex: PageIndex): void {
        this.store.update((project) => {
            project.groups[pageIndex.groupIndex].pages.splice(pageIndex.pageIndexInGroup, 1);
        });
    }
    public movePage(srcIndex: PageIndex, dstIndex: PageIndex): void {
        this.store.update((project) => {
            if (srcIndex.groupIndex === dstIndex.groupIndex) {
                const group = project.groups[srcIndex.groupIndex];
                arrayMoveMutable(group.pages, srcIndex.pageIndexInGroup, dstIndex.pageIndexInGroup);
            } else {
                const [page] = project.groups[srcIndex.groupIndex].pages.splice(srcIndex.pageIndexInGroup, 1);
                project.groups[dstIndex.groupIndex].pages.splice(dstIndex.pageIndexInGroup, 0, page);
            }
        });
    }
}
