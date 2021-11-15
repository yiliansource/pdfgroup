import { PDFDocument } from "pdf-lib";
import * as PDFJS from "pdfjs-dist/build/pdf";

import { PDFPipeMethod } from "../types";

/**
 * A PDF pipe method to flatten the pages of a document to images.
 *
 * @remarks
 * This is achieved by rendering each page to a canvas and embedding the resulting image into a new document, each
 * on an individual page. This may decrease file size for complex pages, and may increase file size for simple pages.
 *
 * @param source The document to be flattened.
 */
export const flattenDocument: PDFPipeMethod = async (source) => {
    const bytes = await source.save();
    const pdfjsSource = await PDFJS.getDocument(bytes).promise;
    const flattened = await PDFDocument.create();

    for (const [index, sourcePage] of source.getPages().entries()) {
        const pdfjsPage = await pdfjsSource.getPage(index + 1);

        // Create a temporary canvas to render the page to internally.
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // We use a scale larger than 1 to render at a higher resolution.
        const viewport = pdfjsPage.getViewport({ scale: 3 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };

        await pdfjsPage.render(renderContext).promise;

        // We save the rendered result to a (compressed) JPEG data URL and embed it on the flattened document.
        const jpgData = canvas.toDataURL("image/jpeg", 0.6);
        const jpgImage = await flattened.embedJpg(jpgData);

        const { width, height } = sourcePage.getSize();
        const page = flattened.addPage([width, height]);
        page.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width,
            height,
        });
    }

    return flattened;
};
