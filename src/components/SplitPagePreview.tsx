import { useEffect, useRef, useState } from "react";

import { SplitPage } from "src/lib/pdf/splitter";

export interface SplitPagePreviewProps {
    page: SplitPage;
}

export function SplitPagePreview({ page }: SplitPagePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (!page || !canvasRef.current) return;

        (async function () {
            const document = await page.source.toPdfjsDocument();
            await renderToCanvas(document, canvasRef.current!, page.page, 127);

            // TODO: Maybe we can cache the canvas rendering results?
            // See: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData

            setRendered(true);

            console.log(`Page ${page.page} (${page.source.name}) rendered.`);
        })();
    }, [page]);

    if (!page) return null;

    return <canvas ref={canvasRef}></canvas>;
}

async function renderToCanvas(
    pdfjsDocument: any,
    canvas: HTMLCanvasElement,
    page: number,
    size: number
): Promise<void> {
    const pdfpage = await pdfjsDocument.getPage(page + 1);

    const viewport = pdfpage.getViewport({ scale: 1 });

    const pageWidth = viewport.width;
    const pageHeight = viewport.height;
    const pageRatio = pageWidth / pageHeight;

    const canvasWidth = size;
    const canvasHeight = Math.round(canvasWidth / pageRatio);
    const scale = canvasWidth / pageWidth;

    const drawViewport = viewport.clone({ scale });

    const context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const renderContext = {
        canvasContext: context,
        viewport: drawViewport,
    };

    await pdfpage.render(renderContext);
}
