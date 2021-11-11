import { Box, styled } from "@mui/system";
import { useDragLayer, XYCoord } from "react-dnd";

import { PageDragInformation } from "src/lib/drag";
import { DragItemTypes, SplitPage } from "src/lib/pdf/splitter";

import { SplitPagePreview } from "./SplitPagePreview";

export function SplitDragLayer() {
    const { item, itemType, currentOffset, isDragging } = useDragLayer((monitor) => ({
        item: monitor.getItem() as PageDragInformation,
        itemType: monitor.getItemType() as DragItemTypes,
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: !!monitor.isDragging(),
    }));

    if (!isDragging) {
        return null;
    }

    return (
        <Root>
            <div style={getItemStyles(currentOffset)}>{renderItem(itemType, item.page)}</div>
        </Root>
    );
}

function getItemStyles(currentOffset: XYCoord | null) {
    if (!currentOffset) {
        return {
            display: "none",
        };
    }

    const { x, y } = currentOffset;
    return {
        transform: `translate(${x}px, ${y}px)`,
    };
}

function renderItem(type: DragItemTypes, item: SplitPage) {
    switch (type) {
        case DragItemTypes.PAGE:
            return (
                <Box sx={{ position: "absolute", transform: "scale(0.9) rotate(7deg)" }}>
                    <SplitPagePreview page={item} />
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
