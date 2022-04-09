import { Backdrop, Paper } from "@mui/material";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { inspectedPageAtom } from "src/lib/atoms/inspectedPageAtom";
import { pageAtom } from "src/lib/atoms/pageAtom";

/**
 * Renders a large preview, used for page inspection and identification.
 *
 * @remarks
 * Unlike the small preview, this large one is not cached, due to the larger size.
 */
export function GroupPageOverlayPreview() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [inspectedPage, setInspectedPage] = useRecoilState(inspectedPageAtom);
    const pageData = useRecoilValue(pageAtom(inspectedPage!));

    useEffect(() => {
        if (!canvasRef.current || !inspectedPage || !pageData) return;

        canvasRef.current.width = Math.min(window.innerWidth * 0.9, 600);

        (async function () {
            const pdfjsDocument = await pageData.source.toPdfjsDocument();

            const canvas = canvasRef.current;
            if (!canvas) throw new Error("Missing canvas reference on page inspection.");

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Missing canvas 2D context.");

            const pdfpage = await pdfjsDocument.getPage(pageData.sourceIndex + 1); // pdf.js pages are 1-indexed.

            const viewport = pdfpage.getViewport({ scale: canvas.width / pdfpage.getViewport({ scale: 1 }).width });

            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };

            await pdfpage.render(renderContext).promise;
        })();
    }, [canvasRef, inspectedPage, pageData]);

    // TODO: Unify this and the other page preview component? Since they basically do the same thing.

    return (
        <Backdrop
            open={!!inspectedPage}
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            onClick={() => setInspectedPage(null)}
        >
            {/* TODO: Add loading indicator? */}
            <Paper elevation={4} sx={{ canvas: { display: "block" } }}>
                <canvas ref={canvasRef} onClick={(e) => e.stopPropagation()}></canvas>
            </Paper>
        </Backdrop>
    );
}
