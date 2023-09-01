import { VirtualPageModel } from '@pdfgroup/editor/models/virtual-page.model';

/**
 * A document inside a project.
 *
 * Documents consist of a collection of virtual pages (from various sources).
 */
export interface VirtualDocumentModel {
    /**
     * The unique ID of the document.
     */
    id: string;
    /**
     * The name of the virtual document.
     */
    name: string;
    /**
     * The pages contained in the document.
     */
    pages: VirtualPageModel[];
}
