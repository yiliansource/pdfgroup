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
    Tooltip,
    Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useState } from "react";

import { SplitGroup } from "src/lib/pdf/splitter";
import { PageLocation } from "src/lib/pdf/types";

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

    /**
     * Handler function to be invoked when the user wants to move a page between two locations.
     */
    movePage(source: PageLocation, dest: PageLocation): void;
    /**
     * Handler function to be invoked when the user wants to move a group between two locations.
     */
    moveGroup(oldGroupIndex: number, newGroupIndex: number): void;
    /**
     * Handler function to be invoked when the user wants to remove a group.
     */
    removeGroup(groupIndex: number): void;
    /**
     * Handler function to be invoked when the user wants to rename a group.
     */
    renameGroup(groupIndex: number, label: string): void;
}

/**
 * An interactive displays of a split group. The user has the ability to rearrange groups, rename them and move
 * pages around inside them via drag and drop.
 */
export const SplitGroupView = React.forwardRef<HTMLDivElement, SplitGroupViewProps>(
    ({ group, groupIndex, totalGroups, movePage, moveGroup, removeGroup, renameGroup }, ref) => {
        const [collapsed, setCollapsed] = useState(false);
        const [showDeleteWarning, setShowDeleteWarning] = useState(false);

        return (
            <Root variant="outlined" sx={{ p: 1 }} ref={ref}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack direction="row">
                        <TextField
                            size="small"
                            variant="outlined"
                            value={group.label}
                            onChange={(e) => renameGroup(groupIndex, e.target.value)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">.pdf</InputAdornment>,
                                sx: {
                                    background: "white",
                                },
                            }}
                        />
                        <Fade in={collapsed}>
                            <Typography mx={1} color="GrayText" lineHeight="40px">
                                {group.pages.length} page(s)
                            </Typography>
                        </Fade>
                    </Stack>
                    <Stack direction="row">
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
                                    disabled={totalGroups <= 1}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>
                </Stack>
                <Collapse in={!collapsed}>
                    <Box mt={1}>
                        <SplitPageList pages={group.pages} groupIndex={groupIndex} movePage={movePage} />
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
            </Root>
        );
    }
);
SplitGroupView.displayName = "SplitGroupView";

const Root = styled(Card)({
    background: "#e8e8e8",
});
