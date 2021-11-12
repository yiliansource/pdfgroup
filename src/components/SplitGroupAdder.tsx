import AddIcon from "@mui/icons-material/Add";
import { Card, IconButton, Stack, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { useDrop } from "react-dnd";

import { DragItemTypes, PageDragInformation } from "../lib/drag";
import { PageLocation } from "./SplitApp";

export interface SplitGroupAdderProps {
    addGroup(...pages: PageLocation[]): void;
}

export function SplitGroupAdder({ addGroup }: SplitGroupAdderProps) {
    const [{ isDropping }, drop] = useDrop(
        () => ({
            accept: DragItemTypes.PAGE,
            drop: (item: PageDragInformation) => {
                addGroup([item.groupIndex, item.pageIndex]);
            },
            collect: (monitor) => ({
                isDropping: !!monitor.isOver() && !!monitor.canDrop(),
            }),
        }),
        [addGroup]
    );

    return (
        <Root variant="outlined" ref={drop} sx={{ background: isDropping ? "#f3f3f3" : "white" }}>
            <Stack height={60} justifyContent="center" alignItems="center">
                <Tooltip title="Add group">
                    <IconButton sx={{ color: "#bbb" }} onClick={() => addGroup()}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Root>
    );
}

const Root = styled(Card)({
    border: "2px dashed #ddd",
    transition: "background 0.2s",
});
