import { Card } from "@mui/material";
import { Box, styled } from "@mui/system";
import { DragDropMonitor } from "dnd-core";
import { CSSProperties } from "react";
import { useDragDropManager, useDragLayer, XYCoord } from "react-dnd";

import { PREVIEW_PAGE_HEIGHT } from "src/lib/constants";
import { DragItemTypes, PageDragInformation } from "src/lib/drag";

import { PagePreview } from "./PagePreview";

/**
 * A custom drag layer, used primarily for rendering a custom document page preview when dragging. This is
 * enabled on both desktop and mobile devices.
 */
export function GroupDragLayer() {
    const { item, itemType, currentOffset, clientOffset, isDragging } = useDragLayer((monitor) => ({
        item: monitor.getItem() as PageDragInformation,
        itemType: monitor.getItemType() as DragItemTypes,
        currentOffset: monitor.getSourceClientOffset(),
        clientOffset: monitor.getClientOffset(),
        isDragging: !!monitor.isDragging(),
    }));
    const dndMonitor = useDragDropManager().getMonitor();

    // If nothing is being dragged, we don't need to render a drag layer.
    if (!isDragging) {
        return null;
    }

    scrollView(clientOffset, dndMonitor);

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
function renderItem(type: DragItemTypes, item: string) {
    switch (type) {
        case DragItemTypes.PAGE:
            return (
                <Box sx={{ position: "absolute", transform: "rotate(7deg)" }}>
                    <Card elevation={4} sx={{ height: PREVIEW_PAGE_HEIGHT }}>
                        <PagePreview page={item} />
                    </Card>
                </Box>
            );
    }
}

function scrollView(offset: XYCoord | null, dndMonitor: DragDropMonitor): void {
    if (offset) {
        let scroll = 0;
        const scrollRegion = Math.min(100, window.innerHeight / 4);
        if (offset.y < scrollRegion) {
            scroll = (-5 * (scrollRegion - offset.y)) / scrollRegion - 1;
        } else if (window.innerHeight - offset.y < Math.min(100, window.innerHeight / 4)) {
            scroll = (5 * (scrollRegion - window.innerHeight + offset.y)) / scrollRegion + 1;
        }

        if (scroll != 0) {
            window.scrollBy({ top: scroll });
            if (dndMonitor.getClientOffset() == offset) {
                window.requestAnimationFrame(() => scrollView(offset, dndMonitor));
            }
        }
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
