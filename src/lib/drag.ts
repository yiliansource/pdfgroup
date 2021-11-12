import { SplitPage } from "./pdf/splitter";

export interface PageDragInformation {
    id: string;
    groupIndex: number;
    pageIndex: number;
    page: SplitPage;
}

export enum DragItemTypes {
    PAGE = "page",
}
