import { LoadingButton } from "@mui/lab";
import {
    Button,
    CircularProgress,
    Collapse,
    Fade,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { TransitionGroup } from "react-transition-group";

import { range } from "src/lib/collections";
import { removeExtension } from "src/lib/io/ext";
import { PdfSource } from "src/lib/pdf/file";
import { SplitEnvironment, SplitGroup, SplitPage } from "src/lib/pdf/splitter";
import { isTouch } from "src/lib/supports";
import { useForceUpdate } from "src/lib/useForceUpdate";

import { SplitDragLayer } from "./SplitDragLayer";
import { SplitGroupView } from "./SplitGroupView";

export interface SplitterAppProps {
    source: PdfSource;
}

export function SplitApp({ source }: SplitterAppProps) {
    const [environment, setEnvironment] = useState<SplitEnvironment | null>(null);
    const [downloading, setDownloading] = useState(false);

    const forceUpdate = useForceUpdate();

    useEffect(() => {
        if (!source) return;

        (async function () {
            const document = await source.toPdflibDocument();
            const pageCount = document.getPageCount();
            const name = removeExtension(source.name);

            const env = new SplitEnvironment(name, [
                new SplitGroup(
                    name,
                    range(0, pageCount).map((i) => new SplitPage(i, source))
                ),
            ]);
            setEnvironment(env);

            console.log("Initialized a new split environment.");
        })();
    }, [source]);

    const touchBackend = useMemo(() => (!isTouch() ? HTML5Backend : TouchBackend), []);

    if (!environment) return null;

    // TODO: Rewrite as immutable updates?

    const renameEnvironment = (label: string) => {
        environment.label = label;

        forceUpdate();
    };
    const movePage = (oldGroupIndex: number, oldPageIndex: number, newGroupIndex: number, newPageIndex: number) => {
        const [page] = environment.groups[oldGroupIndex].pages.splice(oldPageIndex, 1);
        environment.groups[newGroupIndex].pages.splice(newPageIndex, 0, page);

        forceUpdate();

        console.log(`Moved page from [${oldGroupIndex}, ${oldPageIndex}] to [${newGroupIndex}, ${newPageIndex}].`);
    };
    const moveGroup = (oldGroupIndex: number, newGroupIndex: number) => {
        const [group] = environment.groups.splice(oldGroupIndex, 1);
        environment.groups.splice(newGroupIndex, 0, group);

        forceUpdate();

        console.log(`Moved group from ${oldGroupIndex} to ${newGroupIndex}.`);
    };
    const addGroup = () => {
        environment.groups.push(new SplitGroup("test"));

        forceUpdate();

        console.log("Added a new group.");
    };
    const renameGroup = (groupIndex: number, label: string) => {
        environment.groups[groupIndex].label = label;

        forceUpdate();
    };
    const removeGroup = (groupIndex: number) => {
        environment.groups.splice(groupIndex, 1);

        forceUpdate();

        console.log(`Removed group ${groupIndex}.`);
    };
    const download = async () => {
        setDownloading(true);
        await environment.save();
        setDownloading(false);
    };

    return (
        <DndProvider backend={touchBackend}>
            <SplitDragLayer />

            <Box pt={2} pb={16}>
                <Box mb={2}>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="document-title">Folder Name</InputLabel>
                        <OutlinedInput
                            id="document-title"
                            value={environment.label}
                            onChange={(e) => renameEnvironment(e.target.value)}
                            label="Folder Name"
                        />
                    </FormControl>
                </Box>
                <TransitionGroup>
                    {environment.groups.map((group, index) => (
                        <Collapse key={group.id}>
                            <Box mb={1}>
                                <SplitGroupView
                                    group={group}
                                    groupIndex={index}
                                    totalGroups={environment.groups.length}
                                    moveGroup={moveGroup}
                                    movePage={movePage}
                                    removeGroup={removeGroup}
                                    renameGroup={renameGroup}
                                />
                            </Box>
                        </Collapse>
                    ))}
                </TransitionGroup>

                <Button onClick={addGroup}>New Group</Button>
                <LoadingButton onClick={download} loading={downloading}>
                    Download
                </LoadingButton>

                {/* <JSONView data={environment} filter={["id", "label", "groups", "pages", "page", "name", "source"]} /> */}
            </Box>
        </DndProvider>
    );
}
