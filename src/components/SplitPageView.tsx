import { Card } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";

import { PageDragInformation } from "src/lib/drag";
import { DragItemTypes, SplitPage } from "src/lib/pdf/splitter";

export interface SplitPageViewProps {
    page: SplitPage;
    pageIndex: number;
    groupIndex: number;
}

export function SplitPageView({ page, pageIndex, groupIndex }: SplitPageViewProps) {
    const pageRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (!page || !canvasRef.current) return;

        (async function () {
            const document = await page.source.toPdfjsDocument();
            await renderToCanvas(document, canvasRef.current!, page.page, 180);

            setRendered(true);

            // console.log(`Page ${page.page} rendered (${page.source.name}).`);
        })();
    }, [page]);

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: DragItemTypes.PAGE,
            item: (): PageDragInformation => {
                return {
                    id: page.id,
                    groupIndex: groupIndex,
                    pageIndex: pageIndex,
                    clientHeight: 0,
                    clientWidth: 0,
                };
            },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [pageIndex, groupIndex]
    );

    if (!page) return null;

    return (
        <Root ref={pageRef}>
            <Card ref={drag} sx={{ opacity: isDragging ? 0.25 : 1 }}>
                <canvas ref={canvasRef}></canvas>
            </Card>
        </Root>
    );
}

const Root = styled("div")({
    padding: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

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
    const pageRatio = pageHeight / pageWidth;

    const canvasHeight = size;
    const canvasWidth = Math.floor(canvasHeight / pageRatio);
    const scale = canvasHeight / pageHeight;

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
