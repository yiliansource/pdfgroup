import { PDFDocument } from "pdf-lib";
import * as PDFJS from "pdfjs-dist/build/pdf";

import { PDFPipeMethod } from "./types";

export const flattenDocument: PDFPipeMethod = async (source) => {
    const bytes = await source.save();
    const pdfjsSource = await PDFJS.getDocument(bytes).promise;

    const compressed = await PDFDocument.create();

    for (const [index, sourcePage] of source.getPages().entries()) {
        const { width, height } = sourcePage.getSize();
        const page = compressed.addPage([width, height]);

        const pdfjsPage = await pdfjsSource.getPage(index + 1);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const viewport = pdfjsPage.getViewport({ scale: 3 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
        };

        await pdfjsPage.render(renderContext).promise;

        const jpgData = canvas.toDataURL("image/jpeg", 0.6);
        const jpgImage = await compressed.embedJpg(jpgData);

        page.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width,
            height,
        });
    }

    return compressed;
};
