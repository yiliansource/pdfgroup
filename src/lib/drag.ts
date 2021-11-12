import { PageLocation, SplitPage } from "./pdf/splitter";

export interface PageDragInformation {
    id: string;
    location: PageLocation;
    page: SplitPage;
}

export enum DragItemTypes {
    PAGE = "page",
}
