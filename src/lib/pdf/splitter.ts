import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

import { IPdfLibConvertable, PdfSource } from "./file";
import { PDFPipeMethod } from "./pipes/types";

export interface SaveOptions {
    pipes: PDFPipeMethod[];
}

export class SplitEnvironment {
    constructor(public label: string, public groups: SplitGroup[]) {}

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
}

export class SplitGroup implements IPdfLibConvertable {
    public id: string;
    constructor(public label: string, public pages: SplitPage[] = []) {
        this.id = uuidv4();
    }

    public async toPdflibDocument(): Promise<PDFDocument | null> {
        if (this.pages.length <= 0) return null;

        const doc = await PDFDocument.create();

        for (const page of this.pages) {
            const source = await page.source.toPdflibDocument();
            const [sourcePage] = await doc.copyPages(source, [page.page]);

            doc.addPage(sourcePage);
        }

        return doc;
    }
}

export class SplitPage {
    public id: string;
    constructor(public page: number, public source: PdfSource) {
        this.id = uuidv4();
    }
}
