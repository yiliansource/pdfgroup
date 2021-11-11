import { Button, Collapse, FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TransitionGroup } from "react-transition-group";

import { range } from "src/lib/collections";
import { removeExtension } from "src/lib/io/ext";
import { PdfSource } from "src/lib/pdf/file";
import { SplitEnvironment, SplitGroup, SplitPage } from "src/lib/pdf/splitter";
import { useForceUpdate } from "src/lib/useForceUpdate";

import { SplitGroupView } from "./SplitGroupView";

export interface SplitterAppProps {
    source: PdfSource;
}

export function SplitApp({ source }: SplitterAppProps) {
    const [environment, setEnvironment] = useState<SplitEnvironment | null>(null);
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

            console.log("Initialized split environment.");
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source]);

    if (!environment) return null;

    // TODO: Rewrite as immutable updates?

    const renameEnvironment = (label: string) => {
        environment.label = label;

        forceUpdate();
    };
    const movePage = (oldGroupIndex: number, oldPageIndex: number, newGroupIndex: number, newPageIndex: number) => {
        console.log(`Moving page from [${oldGroupIndex},${oldPageIndex}] to [${newGroupIndex},${newPageIndex}].`);

        const [page] = environment.groups[oldGroupIndex].pages.splice(oldPageIndex, 1);
        environment.groups[newGroupIndex].pages.splice(newPageIndex, 0, page);

        forceUpdate();
    };
    const moveGroup = (oldGroupIndex: number, newGroupIndex: number) => {
        const [group] = environment.groups.splice(oldGroupIndex, 1);
        environment.groups.splice(newGroupIndex, 0, group);

        forceUpdate();
    };
    const addGroup = () => {
        environment.groups.push(new SplitGroup("test"));
        forceUpdate();
    };
    const renameGroup = (groupIndex: number, label: string) => {
        environment.groups[groupIndex].label = label;
        forceUpdate();
    };
    const removeGroup = (groupIndex: number) => {
        environment.groups.splice(groupIndex, 1);
        forceUpdate();
    };
    const download = () => {
        environment.save();
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Box pt={2} pb={16}>
                <Box mb={2}>
                    <FormControl variant="outlined">
                        <InputLabel htmlFor="document-title">Document Title</InputLabel>
                        <OutlinedInput
                            id="document-title"
                            value={environment.label}
                            onChange={(e) => renameEnvironment(e.target.value)}
                            endAdornment={<InputAdornment position="end">.pdf</InputAdornment>}
                            label="Document Title"
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
                <Button onClick={download}>Download</Button>

                {/* <JSONView data={environment} filter={["id", "label", "groups", "pages", "page", "name", "source"]} /> */}
            </Box>
        </DndProvider>
    );
}
