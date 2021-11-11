import { useEffect, useRef, useState } from "react";

import { Cache } from "src/lib/cache";
import { SplitPage } from "src/lib/pdf/splitter";

export interface SplitPagePreviewProps {
    page: SplitPage;
}

export interface PreviewCacheData {
    canvasWidth: number;
    canvasHeight: number;
    imageData: ImageData;
}

const renderCache = new Cache<PreviewCacheData, string>();

export function SplitPagePreview({ page }: SplitPagePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (!page || !canvasRef.current) return;

        (async function () {
            const pdfjsDocument = await page.source.toPdfjsDocument();

            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Missing canvas reference on page preview.");

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Missing canvas 2D context.");

            const scale = 2;

            if (renderCache.has(page.id)) {
                const { canvasWidth, canvasHeight, imageData } = renderCache.get(page.id)!;

                canvas.width = canvasWidth * scale;
                canvas.height = canvasHeight * scale;
                canvas.style.width = canvasWidth + "px";
                canvas.style.height = canvasHeight + "px";

                ctx.putImageData(imageData, 0, 0);

                console.log(`Page ${page.page} (${page.source.name}) rendered from cache.`);
            } else {
                const pdfpage = await pdfjsDocument.getPage(page.page + 1);

                const viewport = pdfpage.getViewport({ scale: 1 });

                const pageWidth = viewport.width;
                const pageHeight = viewport.height;
                const pageRatio = pageWidth / pageHeight;

                const canvasWidth = 127;
                const canvasHeight = Math.round(canvasWidth / pageRatio);

                const drawViewport = viewport.clone({ scale: (canvasWidth / pageWidth) * scale });

                canvas.width = canvasWidth * scale;
                canvas.height = canvasHeight * scale;
                canvas.style.width = canvasWidth + "px";
                canvas.style.height = canvasHeight + "px";

                const renderContext = {
                    canvasContext: ctx,
                    viewport: drawViewport,
                };

                await pdfpage.render(renderContext).promise;

                const cacheData: PreviewCacheData = {
                    canvasWidth,
                    canvasHeight,
                    imageData: ctx.getImageData(0, 0, canvasWidth * scale, canvasHeight * scale),
                };
                renderCache.store(page.id, cacheData);

                console.log(`Page ${page.page} (${page.source.name}) rendered and cached.`);
            }

            setRendered(true);
        })();
    }, [page]);

    if (!page) return null;

    return <canvas ref={canvasRef}></canvas>;
}
