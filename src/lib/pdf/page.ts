import { v4 as uuidv4 } from "uuid";

import { PdfSource } from "./soure";
import { IIdentifiable } from "./types";

/**
 * A single page item.
 */
export class Page implements IIdentifiable {
    public id: string;
    public source: PdfSource;
    public sourceIndex: number;

    constructor(pageIndex: number, source: PdfSource) {
        this.id = uuidv4();
        this.sourceIndex = pageIndex;
        this.source = source;
    }
}
