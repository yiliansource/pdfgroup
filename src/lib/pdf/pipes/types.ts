import { PDFDocument } from "pdf-lib";

export type PDFPipeMethod = (source: PDFDocument) => Promise<PDFDocument>;
