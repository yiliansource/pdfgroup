import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

import { SplitGroup } from "src/lib/pdf/splitter";

import { SplitPageList } from "./SplitPageList";

export interface SplitGroupViewProps {
    group: SplitGroup;
    groupIndex: number;
    totalGroups: number;

    movePage(oldGroupIndex: number, oldPageIndex: number, newGroupIndex: number, newPageIndex: number): void;
    moveGroup(oldGroupIndex: number, newGroupIndex: number): void;
    removeGroup(groupIndex: number): void;
    renameGroup(groupIndex: number, label: string): void;
}

export const SplitGroupView = React.forwardRef<HTMLDivElement, SplitGroupViewProps>(
    ({ group, groupIndex, totalGroups, movePage, moveGroup, removeGroup, renameGroup }, ref) => {
        return (
            <Root variant="outlined" ref={ref}>
                <Stack mb={2} direction="row" justifyContent="space-between" alignItems="flex-start">
                    <TextField
                        value={group.label}
                        onChange={(e) => renameGroup(groupIndex, e.target.value)}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">.pdf</InputAdornment>,
                            sx: {
                                background: "white",
                            },
                        }}
                    />
                    <Stack m={-1} direction="row">
                        <IconButton onClick={() => moveGroup(groupIndex, groupIndex - 1)} disabled={groupIndex <= 0}>
                            <ArrowUpward />
                        </IconButton>
                        <IconButton
                            onClick={() => moveGroup(groupIndex, groupIndex + 1)}
                            disabled={groupIndex >= totalGroups - 1}
                        >
                            <ArrowDownward />
                        </IconButton>
                        <IconButton onClick={() => removeGroup(groupIndex)} disabled={totalGroups <= 1}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <SplitPageList pages={group.pages} groupIndex={groupIndex} movePage={movePage} />
            </Root>
        );
    }
);
SplitGroupView.displayName = "SplitGroupView";

const Root = styled(Card)({
    background: "#e8e8e8",
    padding: 20,
});
