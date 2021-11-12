import { Card } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useDragLayer, XYCoord } from "react-dnd";

import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { SplitPage } from "src/lib/pdf/splitter";

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
                <Box sx={{ position: "absolute", transform: "scale(1) rotate(7deg)" }}>
                    <Card elevation={4} sx={{ height: 180 }}>
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
