/**
 * The source of a virtual page.
 */
export interface VirtualPageSourceIndex {
    /**
     * The actual source document.
     */
    documentId: string;
    /**
     * The index of the page in the source document.
     */
    pageIndex: number;
}
