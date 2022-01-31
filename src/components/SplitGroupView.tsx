import { useTheme } from "@emotion/react";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseFullIcon from "@mui/icons-material/CloseFullscreen";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenFullIcon from "@mui/icons-material/OpenInFull";
import {
    Button,
    Card,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Fade,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Theme,
    Tooltip,
    Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDrop } from "react-dnd";

import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { useSplitContext } from "src/lib/hooks/useSplitContext";
import { SplitGroup } from "src/lib/pdf/splitter";

import { SplitPageList } from "./SplitPageList";

export interface SplitGroupViewProps {
    /**
     * The group that should be displayed.
     */
    group: SplitGroup;
    /**
     * The index of the group.
     */
    groupIndex: number;
    /**
     * The total number of groups that will be displayed.
     */
    totalGroups: number;
}

/**
 * An interactive displays of a split group. The user has the ability to rearrange groups, rename them and move
 * pages around inside them via drag and drop.
 */
export const SplitGroupView = React.forwardRef<HTMLDivElement, SplitGroupViewProps>(
    ({ group, groupIndex, totalGroups }, ref) => {
        const { movePage, moveGroup, removeGroup, renameGroup } = useSplitContext();
        const [collapsed, setCollapsed] = useState(false);
        const [showDeleteWarning, setShowDeleteWarning] = useState(false);
        const isDarkTheme = (useTheme() as Theme).palette.mode === "dark";

        // Allow page dropping into collapsed groups.
        const [{ isHovering }, drop] = useDrop(
            () => ({
                accept: DragItemTypes.PAGE,
                collect: (monitor) => ({
                    isHovering: !!monitor.isOver() && !!monitor.canDrop(),
                }),
                drop: (item: PageDragInformation) => {
                    movePage(item.location, {
                        group: groupIndex,
                        page: group.pages.length,
                    });
                },
                canDrop: () => collapsed,
            }),
            [collapsed, groupIndex]
        );

        return (
            <Card
                variant="outlined"
                sx={{
                    p: 1,
                    background: !isHovering ? grey[isDarkTheme ? 800 : 300] : grey[isDarkTheme ? 700 : 400],
                    transition: "0.2s background",
                }}
                ref={ref}
            >
                <Stack
                    ref={drop}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <Stack direction="row" alignSelf="stretch">
                        <TextField
                            size="small"
                            variant="outlined"
                            value={group.label}
                            onChange={(e) => renameGroup(groupIndex, e.target.value)}
                            autoComplete="off"
                            fullWidth
                            InputProps={{
                                endAdornment: <InputAdornment position="end">.pdf</InputAdornment>,
                                sx: {
                                    background: isDarkTheme ? grey[900] : grey[100],
                                },
                            }}
                        />
                        <Fade in={collapsed}>
                            <Typography
                                mx={1}
                                color="GrayText"
                                lineHeight="40px"
                                sx={{ display: { xs: "none", sm: "inline-block" }, flexShrink: 0 }}
                            >
                                {group.pages.length} page(s)
                            </Typography>
                        </Fade>
                    </Stack>
                    <Stack direction="row" alignSelf="flex-end">
                        <Tooltip title={collapsed ? "Expand" : "Collapse"}>
                            <IconButton onClick={() => setCollapsed((c) => !c)}>
                                {collapsed ? <OpenFullIcon /> : <CloseFullIcon />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Move up">
                            <span>
                                <IconButton
                                    onClick={() => moveGroup(groupIndex, groupIndex - 1)}
                                    disabled={groupIndex <= 0}
                                >
                                    <ArrowUpwardIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Move down">
                            <span>
                                <IconButton
                                    onClick={() => moveGroup(groupIndex, groupIndex + 1)}
                                    disabled={groupIndex >= totalGroups - 1}
                                >
                                    <ArrowDownward />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <span>
                                <IconButton
                                    onClick={() =>
                                        // If the group contains items, we want to display a warning before deleting.
                                        group.pages.length > 0 ? setShowDeleteWarning(true) : removeGroup(groupIndex)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>
                </Stack>

                <Collapse in={!collapsed}>
                    <Box mt={1}>
                        <SplitPageList pages={group.pages} groupIndex={groupIndex} />
                    </Box>
                </Collapse>

                <Dialog open={showDeleteWarning}>
                    <DialogContent>
                        <DialogContentText>
                            You are about to delete a group with {group.pages.length} page(s). Once they are removed
                            from the document you can only re-add them by importing them again.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDeleteWarning(false)}>Cancel</Button>
                        <Button onClick={() => removeGroup(groupIndex)}>Delete Group</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        );
    }
);
SplitGroupView.displayName = "SplitGroupView";
