import type { PDFDocument as PDFLibDocument } from "pdf-lib";

/**
 * Indicates that an object instance can be labelled by a string.
 */
export interface ILabelled {
    /**
     * The label that identifies an object to the user.
     */
    label: string;
}

/**
 * Indicates that an object instance can be uniquely identified by an ID.
 */
export interface IIdentifiable {
    /**
     * The unique ID that the object can be identified with.
     */
    id: string;
}

/**
 * Indicates that an object instance can be asynchronously converted to a pdf-lib document.
 */
export interface IPdfLibConvertable {
    /**
     * Converts the object into a pdf-lib document.
     */
    toPdflibDocument(): Promise<PDFLibDocument | null>;
}

/**
 * Indicates that an object instance can be asynchronously converted to a pdf.js document.
 */
export interface IPdfjsConvertable {
    /**
     * Converts the object into a pdf.js document.
     */
    toPdfjsDocument(): Promise<PDFJsDocument | null>;
}

/**
 * Indicates that an object instance can be asynchronously converted into both pdf-lib and pdf.js documents.
 */
export interface IPdfDocumentConvertable extends IPdfLibConvertable, IPdfjsConvertable {}

/**
 * Provides options that a split environment can be saved with.
 */
export interface SaveOptions {
    /**
     * The pipes that should be applied to each group document during saving.
     */
    pipes: PDFPipeMethod[];
}

/**
 * Represents the location of a page inside a split environment, as a tuple of group and page indices.
 */
export type PageLocation = { group: number; page: number };
/**
 * A method that pipes a pdf-lib document into a new one.
 */
export type PDFPipeMethod = (source: PDFLibDocument) => Promise<PDFLibDocument>;

/**
 * Represents a type for pdf.js documents. This only used since the typings for pdf.js are broken.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PDFJsDocument = any;
