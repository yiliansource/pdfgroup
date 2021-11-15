import { SplitPage } from "./pdf/splitter";
import { PageLocation } from "./pdf/types";

/**
 * Holds information about a currently dragged page.
 */
export interface PageDragInformation {
    /**
     * The location where the dragged page was, before the drag operation started.
     */
    location: PageLocation;
    /**
     * The underlying page object instance.
     */
    page: SplitPage;
}

/**
 * The item types that are draggable.
 */
export enum DragItemTypes {
    PAGE = "page",
}
