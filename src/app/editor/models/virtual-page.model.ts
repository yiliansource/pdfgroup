import { VirtualPageSourceIndex } from '@pdfgroup/editor/util/virtual-page-source.index';
import { Dimensions } from '@pdfgroup/shared/util/dimensions/model';
import { MM } from '@pdfgroup/shared/util/units';

/**
 * A page inside a document.
 *
 * Pages itself do not hold their content, but rather a source reference to where their content can be found.
 */
export interface VirtualPageModel {
    /**
     * The unique ID of the page.
     */
    id: string;
    /**
     * The source of the page content.
     */
    source: VirtualPageSourceIndex;
    /**
     * The size of the page.
     */
    size: Dimensions<MM>;
}
