import { VirtualPageSourceIndex } from '@pdfgroup/editor/util/virtual-page-source.index';

export function getPreviewDataId(index: VirtualPageSourceIndex): string {
    return `${index.documentId}_${index.pageIndex}`;
}
