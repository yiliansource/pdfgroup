import { VirtualDocumentModel } from '@pdfgroup/editor/models/virtual-document.model';

/**
 * A project in the application.
 *
 * Projects consist of a collection of virtual documents and additional metadata.
 */
export interface ProjectModel {
    /**
     * The unique ID of the project.
     */
    id: string;
    /**
     * The name of the project. This will be used as the exported folder name.
     */
    name: string;
    /**
     * The documents contained in the project.
     */
    documents: VirtualDocumentModel[];
}
