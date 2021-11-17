import { PDFDocument as PDFLibDocument } from "pdf-lib";
import * as PDFJS from "pdfjs-dist/build/pdf";

import { readFile } from "../io/read";
import { IPdfDocumentConvertable, PDFJsDocument } from "./types";

/**
 * Holds the source information for a PDF file. This includes the filename and the binary data.
 */
export class PdfSource implements IPdfDocumentConvertable {
    /**
     * Creates a new instance of a PDF source, using a name and data.
     */
    public constructor(public name: string, public data: ArrayBuffer) {}

    private _pdflib: PDFLibDocument | null = null;
    private _pdfjs: PDFJsDocument | null = null;

    public async toPdflibDocument(): Promise<PDFLibDocument> {
        if (!this._pdflib) this._pdflib = await PDFLibDocument.load(this.data);
        return this._pdflib;
    }
    public async toPdfjsDocument(): Promise<PDFJsDocument> {
        if (!this._pdfjs) this._pdfjs = PDFJS.getDocument(this.data).promise;
        return this._pdfjs;
    }

    /**
     * Reads the specified file and returns the source file instance from it.
     */
    public static async fromFile(file: File): Promise<PdfSource> {
        const content = await readFile(file);
        return new PdfSource(file.name, content);
    }
}
