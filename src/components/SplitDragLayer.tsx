import { Card } from "@mui/material";
import { Box, styled } from "@mui/system";
import { CSSProperties } from "react";
import { useDragLayer, XYCoord } from "react-dnd";

import { PREVIEW_PAGE_HEIGHT } from "src/lib/constants";
import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { SplitPage } from "src/lib/pdf/splitter";

import { SplitPagePreview } from "./SplitPagePreview";

/**
 * A custom drag layer, used primarily for rendering a custom document page preview when dragging. This is
 * enabled on both desktop and mobile devices.
 */
export function SplitDragLayer() {
    const { item, itemType, currentOffset, isDragging } = useDragLayer((monitor) => ({
        item: monitor.getItem() as PageDragInformation,
        itemType: monitor.getItemType() as DragItemTypes,
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: !!monitor.isDragging(),
    }));

    // If nothing is being dragged, we don't need to render a drag layer.
    if (!isDragging) {
        return null;
    }

    return (
        <Root>
            <div style={getItemStyles(currentOffset)}>{renderItem(itemType, item.page)}</div>
        </Root>
    );
}

/**
 * Computes CSS styles used for the dragged item preview container.
 */
function getItemStyles(offset: XYCoord | null): CSSProperties {
    return offset
        ? {
              transform: `translate(${offset.x}px, ${offset.y}px)`,
          }
        : {
              display: "none",
          };
}

/**
 * Renders the currently dragged item to a JSX element.
 */
function renderItem(type: DragItemTypes, item: SplitPage) {
    switch (type) {
        case DragItemTypes.PAGE:
            return (
                <Box sx={{ position: "absolute", transform: "rotate(7deg)" }}>
                    <Card elevation={4} sx={{ height: PREVIEW_PAGE_HEIGHT }}>
                        <SplitPagePreview page={item} />
                    </Card>
                </Box>
            );
    }
}

const Root = styled("div")({
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
});
