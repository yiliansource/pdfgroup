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
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { useRecoilState, useRecoilValue } from "recoil";

import { groupNameAtom } from "src/lib/atoms/groupNameAtom";
import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { useGroupActions, usePageActions } from "src/lib/hooks/appActions";
import { useThemeMode } from "src/lib/hooks/useThemeMode";
import { groupNamePlaceholderSelector } from "src/lib/selectors/groupNamePlaceholderSelector";
import { groupPositionSelector } from "src/lib/selectors/groupPositionSelector";
import { pageCountSelector } from "src/lib/selectors/pageCountSelector";

import { PageList } from "./PageList";

export interface GroupViewProps {
    /**
     * The group that should be displayed.
     */
    group: string;
}

/**
 * An interactive display of a group. The user has the ability to rearrange groups, rename them and move
 * pages around inside them via drag and drop.
 */
export const GroupView = React.forwardRef<HTMLDivElement, GroupViewProps>(({ group }, ref) => {
    const groupActions = useGroupActions();
    const pageActions = usePageActions();

    const [collapsed, setCollapsed] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);

    const [groupName, setGroupName] = useRecoilState(groupNameAtom(group));
    const pageCount = useRecoilValue(pageCountSelector(group));
    const groupPosition = useRecoilValue(groupPositionSelector(group));
    const placeholder = useRecoilValue(groupNamePlaceholderSelector(group));

    const isDarkTheme = useThemeMode() === "dark";

    // Allow page dropping into collapsed groups.
    const [{ isHovering }, drop] = useDrop(
        () => ({
            accept: DragItemTypes.PAGE,
            collect: (monitor) => ({
                isHovering: !!monitor.isOver() && !!monitor.canDrop(),
            }),
            drop: (item: PageDragInformation) => {
                pageActions.move(item.page, group, pageCount);
            },
            canDrop: () => collapsed,
        }),
        [group, collapsed, pageCount]
    );

    const handleLabelKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();

            const inputs = Array.from(document.querySelectorAll<HTMLElement>(".group-label-input"));
            const index = inputs.indexOf(e.currentTarget as HTMLElement) + (e.key === "ArrowDown" ? 1 : -1);

            if (index >= 0 && inputs.length > index) {
                inputs[index].querySelector("input")!.focus();
            }
        }
    };

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
                        value={groupName}
                        className="group-label-input"
                        onChange={(e) => setGroupName(e.target.value)}
                        onKeyDown={handleLabelKeyDown}
                        autoComplete="off"
                        placeholder={placeholder}
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
                            {pageCount} page(s)
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
                                onClick={() => groupActions.move(group, groupPosition.index - 1)}
                                disabled={groupPosition.first}
                            >
                                <ArrowUpwardIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Move down">
                        <span>
                            <IconButton
                                onClick={() => groupActions.move(group, groupPosition.index + 1)}
                                disabled={groupPosition.last}
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
                                    pageCount > 0 ? setShowDeleteWarning(true) : groupActions.remove(group)
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
                    <PageList group={group} />
                </Box>
            </Collapse>

            <Dialog open={showDeleteWarning}>
                <DialogContent>
                    <DialogContentText>
                        You are about to delete a group with {pageCount} page(s). Once they are removed from the
                        document you can only re-add them by importing them again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteWarning(false)}>Cancel</Button>
                    <Button onClick={() => groupActions.remove(group)}>Delete Group</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
});
GroupView.displayName = "GroupView";
