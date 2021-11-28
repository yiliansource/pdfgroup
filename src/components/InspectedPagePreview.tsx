import { Paper } from "@mui/material";
import { useEffect, useRef } from "react";

import { SplitPage } from "src/lib/pdf/splitter";

export interface InspectedPagePreviewProps {
    /**
     * The page that should be displayed.
     */
    page?: SplitPage;
}

/**
 * Renders a large preview, used for page inspection and identification.
 */
export function InspectedPagePreview({ page }: InspectedPagePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !page) return;

        canvasRef.current.width = Math.min(window.innerWidth * 0.9, 600);

        (async function () {
            const pdfjsDocument = await page.source.toPdfjsDocument();

            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Missing canvas reference on page inspection.");

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Missing canvas 2D context.");

            const pdfpage = await pdfjsDocument.getPage(page.index + 1); // pdf.js pages are 1-indexed.

            const viewport = pdfpage.getViewport({ scale: canvas.width / pdfpage.getViewport({ scale: 1 }).width });

            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };

            await pdfpage.render(renderContext).promise;
        })();
    }, [canvasRef, page]);

    // TODO: Unify this and the other page preview component? Since they basically do the same thing.
    return (
        <Paper elevation={4} sx={{ canvas: { display: "block" } }}>
            <canvas ref={canvasRef} onClick={(e) => e.stopPropagation()}></canvas>
        </Paper>
    );
}
