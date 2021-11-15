import AddIcon from "@mui/icons-material/Add";
import { Card, IconButton, Stack, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { useDrop } from "react-dnd";

import { PageLocation } from "src/lib/pdf/types";

import { DragItemTypes, PageDragInformation } from "../lib/drag";

export interface SplitGroupAdderProps {
    /**
     * Handler method to invoke when a group should be added.
     * Optionally, an initial page can be specified, to populate the group.
     */
    addGroup(initial?: PageLocation): void;
}

/**
 * An app widget that allows users to add new groups by either clicking an "add" button, or by simply dragging an
 * existing page onto it.
 */
export function SplitGroupAdder({ addGroup }: SplitGroupAdderProps) {
    const [{ isDropping }, drop] = useDrop(() => ({
        accept: DragItemTypes.PAGE,
        drop: (item: PageDragInformation) => {
            addGroup(item.location);
        },
        collect: (monitor) => ({
            isDropping: !!monitor.isOver() && !!monitor.canDrop(),
        }),
    }));

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
