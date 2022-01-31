import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

import { PdfSource } from "./file";
import { IIdentifiable, ILabelled, IPdfLibConvertable, PageLocation, SaveOptions } from "./types";

/**
 * An environment that holds pages that can be ordered into groups.
 */
export class GroupEnvironment implements ILabelled {
    public label: string;
    public groups: PageGroup[];

    constructor(label: string, groups: PageGroup[]) {
        this.label = label;
        this.groups = groups;
    }

    /**
     * Saves the environment into a ZIP-archive.
     */
    public async save(options?: SaveOptions): Promise<void> {
        options = Object.assign(
            {},
            {
                pipes: [],
            } as SaveOptions,
            options
        ) as Required<SaveOptions>;

        const zip = new JSZip();

        for (const group of this.groups) {
            const doc = await group.toPdflibDocument();
            if (!doc) continue;

            // Send the document through all the provided pipe operations.
            const piped = await options.pipes.reduce(
                async (piping, pipe) => await pipe(await piping),
                Promise.resolve(doc)
            );

            const bytes = await piped.save();
            zip.file(group.label + ".pdf", bytes);
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, this.label + ".zip");
    }

    /**
     * Returns the desired page in the environment, identified by a page index.
     */
    public getPage(location: PageLocation): Page {
        return this.groups[location.group].pages[location.page];
    }
}

/**
 * A group containing ordered pages, contained in an environment.
 */
export class PageGroup implements IIdentifiable, ILabelled, IPdfLibConvertable {
    public id: string;
    public label: string;
    public pages: Page[];

    constructor(label: string, pages: Page[] = []) {
        this.id = uuidv4();
        this.label = label;
        this.pages = pages;
    }

    public async toPdflibDocument(): Promise<PDFDocument | null> {
        if (this.pages.length <= 0) return null;

        const doc = await PDFDocument.create();

        for (const page of this.pages) {
            const source = await page.source.toPdflibDocument();
            const [sourcePage] = await doc.copyPages(source, [page.index]);

            doc.addPage(sourcePage);
        }

        return doc;
    }
}

/**
 * A single page contained in a group.
 */
export class Page implements IIdentifiable {
    public id: string;
    public index: number;
    public source: PdfSource;

    constructor(page: number, source: PdfSource) {
        this.id = uuidv4();
        this.index = page;
        this.source = source;
    }
}
