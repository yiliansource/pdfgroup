import { PDFDocument as PDFLibDocument } from "pdf-lib";
import * as PDFJS from "pdfjs-dist/build/pdf";

import { readFile } from "../io/read";

export class PdfSource implements IPdfDocumentConvertable {
    public constructor(public name: string, public data: ArrayBuffer) {}

    private _pdflib: PDFLibDocument | null = null;
    private _pdfjs: any | null = null;

    public async toPdflibDocument(): Promise<PDFLibDocument> {
        if (!this._pdflib) this._pdflib = await PDFLibDocument.load(this.data);
        return this._pdflib;
    }
    public async toPdfjsDocument(): Promise<any> {
        if (!this._pdfjs) this._pdfjs = PDFJS.getDocument(this.data).promise;
        return this._pdfjs;
    }

    public static async fromFile(file: File): Promise<PdfSource> {
        const content = await readFile(file);
        return new PdfSource(file.name, content);
    }
}

export interface IPdfLibConvertable {
    toPdflibDocument(): Promise<PDFLibDocument | null>;
}

export interface IPdfjsConvertable {
    toPdfjsDocument(): Promise<any | null>;
}

export interface IPdfDocumentConvertable extends IPdfLibConvertable, IPdfjsConvertable {}
