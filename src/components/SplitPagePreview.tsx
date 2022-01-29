import { useEffect, useRef } from "react";

import { PREVIEW_PAGE_HEIGHT, PREVIEW_PAGE_WIDTH } from "src/lib/constants";
import logger from "src/lib/log";
import { SplitPage } from "src/lib/pdf/splitter";

export interface SplitPagePreviewProps {
    /**
     * The page that a preview should be rendered for.
     */
    page: SplitPage;
}

// A cache that preview rendering data should be stored in.
const renderCache = new Map<string, ImageData>();
// A quality scale that the previews should be rendered at.
const qualityScale = 2;

/**
 * A rendered preview of a single page in a PDF.
 */
export function SplitPagePreview({ page }: SplitPagePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!page) return;

        (async function () {
            const pdfjsDocument = await page.source.toPdfjsDocument();

            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Missing canvas reference on page preview.");

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Missing canvas 2D context.");

            // TODO: There is a weird bug that occurs when dragging and dropping pages quickly in succession, resulting
            // in blank pages being rendered. This should be investigated and fixed.

            if (renderCache.has(page.id)) {
                const imageData = renderCache.get(page.id)!;
                ctx.putImageData(imageData, 0, 0);

                logger.debug(`Page ${page.index} (${page.source.name}) was rendered from cache.`);
            } else {
                const pdfpage = await pdfjsDocument.getPage(page.index + 1); // pdf.js pages are 1-indexed.

                const viewport = pdfpage.getViewport({ scale: 1 });
                const drawViewport = viewport.clone({ scale: (PREVIEW_PAGE_WIDTH / viewport.width) * qualityScale });

                const renderContext = {
                    canvasContext: ctx,
                    viewport: drawViewport,
                };

                await pdfpage.render(renderContext).promise;

                const cacheData = ctx.getImageData(
                    0,
                    0,
                    PREVIEW_PAGE_WIDTH * qualityScale,
                    PREVIEW_PAGE_HEIGHT * qualityScale
                );
                renderCache.set(page.id, cacheData);

                logger.debug(`Page ${page.index} (${page.source.name}) was rendered and cached.`);
            }
        })();
    }, [page]);

    return (
        <canvas
            ref={canvasRef}
            width={PREVIEW_PAGE_WIDTH * qualityScale}
            height={PREVIEW_PAGE_HEIGHT * qualityScale}
            style={{ width: PREVIEW_PAGE_WIDTH + "px", height: PREVIEW_PAGE_HEIGHT + "px" }}
        ></canvas>
    );
}
