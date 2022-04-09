/**
 * Holds information about a currently dragged page.
 */
export interface PageDragInformation {
    group: string;
    page: string;
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
