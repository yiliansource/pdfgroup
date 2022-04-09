import AddIcon from "@mui/icons-material/Add";
import { IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/system";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { useFileActions, useGroupActions } from "src/lib/hooks/appActions";

import { DragItemTypes, FileDropInformation, PageDragInformation } from "../../lib/drag";

/**
 * An app widget that allows users to add new groups by either clicking an "add" button, or by simply dragging an
 * existing page onto it.
 */
export function GroupAdder() {
    const groupActions = useGroupActions();
    const fileActions = useFileActions();

    const [{ isDropping }, drop] = useDrop<PageDragInformation | FileDropInformation, void, { isDropping: boolean }>(
        () => ({
            accept: [DragItemTypes.PAGE, NativeTypes.FILE],
            drop: (item, monitor) => {
                switch (monitor.getItemType()) {
                    case DragItemTypes.PAGE:
                        item = item as PageDragInformation;
                        groupActions.add(item.page);
                        break;
                    case NativeTypes.FILE:
                        item = item as FileDropInformation;
                        fileActions.import(...item.files);
                        break;
                }
            },
            collect: (monitor) => ({
                isDropping: !!monitor.isOver() && !!monitor.canDrop(),
            }),
        }),
        []
    );

    return (
        <Root variant="outlined" ref={drop}>
            <Stack
                p={2}
                justifyContent="center"
                alignItems="center"
                sx={{ opacity: isDropping ? 0.3 : 1, transition: "opacity 0.2s" }}
            >
                <Tooltip title="Add group">
                    <IconButton sx={{ color: "#bbb" }} onClick={() => groupActions.add()}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Typography mt={1} color="#777" textAlign="center">
                    Drop documents or pages here to create a new group!
                </Typography>
            </Stack>

            <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    pointerEvents: "none",
                    opacity: isDropping ? 1 : 0,
                    transition: "opacity 0.2s",
                }}
            >
                <Typography>Drop it like it&apos;s hot!</Typography>
            </Stack>
        </Root>
    );
}

const Root = styled(Paper)(({ theme }) => ({
    border: `2px dashed ${theme.palette.mode === "light" ? grey[300] : grey[800]}`,
    transition: "background 0.2s",
    position: "relative",
}));
