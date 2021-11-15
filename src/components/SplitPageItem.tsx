import { Card, Stack } from "@mui/material";
import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { PREVIEW_PAGE_HEIGHT, PREVIEW_PAGE_WIDTH } from "src/lib/constants";
import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { SplitPage } from "src/lib/pdf/splitter";

import { SplitPagePreview } from "./SplitPagePreview";

export interface SplitPageViewProps {
    /**
     * The page that should be displayed.
     */
    page: SplitPage;
    /**
     * The index of the page.
     */
    pageIndex: number;
    /**
     * The index of the group the page is in.
     */
    groupIndex: number;
}

/**
 * An interactive display of a page item, located inside a group. This can be dragged and rearranged inside groups.
 */
export function SplitPageItem({ page, pageIndex, groupIndex }: SplitPageViewProps) {
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: DragItemTypes.PAGE,
            item: (): PageDragInformation => {
                return {
                    location: {
                        group: groupIndex,
                        page: pageIndex,
                    },
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
        // Ensure that no drag preview is shown, since we want to render it on the drag layer.
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    if (!page) return null;

    return (
        <Stack sx={{ position: "relative", cursor: "pointer" }} justifyContent="center" alignItems="center">
            <Card
                ref={drag}
                sx={{ opacity: isDragging ? 0.5 : 1, height: PREVIEW_PAGE_HEIGHT, width: PREVIEW_PAGE_WIDTH }}
            >
                <SplitPagePreview page={page} />
            </Card>
        </Stack>
    );
}
