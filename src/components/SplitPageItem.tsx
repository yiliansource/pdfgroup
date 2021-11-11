import { Card } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { PageDragInformation } from "src/lib/drag";
import { DragItemTypes, SplitPage } from "src/lib/pdf/splitter";

import { SplitPagePreview } from "./SplitPagePreview";

export interface SplitPageViewProps {
    page: SplitPage;
    pageIndex: number;
    groupIndex: number;
}

export function SplitPageItem({ page, pageIndex, groupIndex }: SplitPageViewProps) {
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: DragItemTypes.PAGE,
            item: (): PageDragInformation => {
                return {
                    id: page.id,
                    groupIndex: groupIndex,
                    pageIndex: pageIndex,
                    page: page,
                };
            },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [pageIndex, groupIndex]
    );

    useEffect(() => {
        // ensure that no drag preview is shown, since we want to render it on the drag layer
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    if (!page) return null;

    return (
        <Root>
            <Card ref={drag} sx={{ opacity: isDragging ? 0.5 : 1 }}>
                <SplitPagePreview page={page} />
            </Card>
        </Root>
    );
}

const Root = styled("div")({
    padding: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",

    ".MuiPaper-root": {
        height: 180,
        width: 127,
        overflow: "hidden",
    },
});
