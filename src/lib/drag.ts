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

/**
 * Holds information about a dropped file (list).
 */
export interface FileDropInformation {
    /**
     * The native files that were dropped.
     */
    files: File[];
}
