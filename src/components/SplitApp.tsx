import DownloadIcon from "@mui/icons-material/Download";
import { LoadingButton } from "@mui/lab";
import {
    Collapse,
    FormControl,
    FormControlLabel,
    InputLabel,
    OutlinedInput,
    Stack,
    Switch,
    Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import update from "immutability-helper";
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { TransitionGroup } from "react-transition-group";

import { range } from "src/lib/collections";
import { removeExtension } from "src/lib/io/ext";
import { PdfSource } from "src/lib/pdf/file";
import { flattenDocument } from "src/lib/pdf/pipes/flattener";
import { PDFPipeMethod } from "src/lib/pdf/pipes/types";
import { PageLocation, SplitEnvironment, SplitGroup, SplitPage } from "src/lib/pdf/splitter";
import { isTouch } from "src/lib/supports";

import { JsonView } from "./JsonView";
import { SplitDragLayer } from "./SplitDragLayer";
import { SplitGroupAdder } from "./SplitGroupAdder";
import { SplitGroupView } from "./SplitGroupView";

export interface SplitterAppProps {
    source: PdfSource;
}

export function SplitApp({ source }: SplitterAppProps) {
    const [environment, setEnvironment] = useState<SplitEnvironment | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [flatten, setFlatten] = useState(false);

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

    const renameEnvironment = (label: string) => {
        setEnvironment((e) =>
            update(e, {
                label: { $set: label },
            })
        );
    };
    const movePage = (source: PageLocation, dest: PageLocation) => {
        if (source.group === dest.group && source.page === dest.page) return;

        setEnvironment((e) => {
            const page = e!.getPage(source);
            return source.group === dest.group
                ? update(e, {
                      groups: {
                          [dest.group]: {
                              pages: {
                                  $splice: [
                                      [source.page, 1],
                                      [dest.page, 0, page],
                                  ],
                              },
                          },
                      },
                  })
                : update(e, {
                      groups: {
                          [source.group]: { pages: { $splice: [[source.page, 1]] } },
                          [dest.group]: { pages: { $splice: [[dest.page, 0, page]] } },
                      },
                  });
        });

        console.log(`Moved page from [${source.group}, ${source.page}] to [${dest.group}, ${dest.page}].`);
    };
    const moveGroup = (sourceIndex: number, destIndex: number) => {
        if (sourceIndex === destIndex) return;

        setEnvironment((e) => {
            const group = environment.groups[sourceIndex];
            return update(e, {
                groups: {
                    $splice: [
                        [sourceIndex, 1],
                        [destIndex, 0, group],
                    ],
                },
            });
        });

        console.log(`Moved group from ${sourceIndex} to ${destIndex}.`);
    };
    const addGroup = (initial?: PageLocation) => {
        setEnvironment((e) => {
            if (initial) {
                const page = e!.getPage(initial);

                return update(e, {
                    groups: {
                        [initial.group]: { pages: { $splice: [[initial.page, 1]] } },
                        $push: [new SplitGroup("", [page])],
                    },
                });
            } else {
                return update(e, {
                    groups: {
                        $push: [new SplitGroup("")],
                    },
                });
            }
        });

        console.log(`Added a new group.`);
    };
    const renameGroup = (groupIndex: number, label: string) => {
        setEnvironment((e) =>
            update(e, {
                groups: {
                    [groupIndex]: {
                        label: { $set: label },
                    },
                },
            })
        );
    };
    const removeGroup = (groupIndex: number) => {
        setEnvironment((e) =>
            update(e, {
                groups: {
                    $splice: [[groupIndex, 1]],
                },
            })
        );

        console.log(`Removed group ${groupIndex}.`);
    };
    const download = async () => {
        setDownloading(true);

        const pipes: PDFPipeMethod[] = [];
        if (flatten) pipes.push(flattenDocument);
        await environment.save({ pipes });

        setDownloading(false);
    };

    return (
        <DndProvider backend={touchBackend}>
            <SplitDragLayer />

            <Box pt={2} pb={16}>
                <Box mb={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2}>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="document-title">Folder Name</InputLabel>
                                <OutlinedInput
                                    id="document-title"
                                    value={environment.label}
                                    onChange={(e) => renameEnvironment(e.target.value)}
                                    label="Folder Name"
                                />
                            </FormControl>
                            <LoadingButton
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={download}
                                loading={downloading}
                            >
                                Download
                            </LoadingButton>
                        </Stack>
                        <Stack>
                            <Tooltip title="Renders the document pages to images before exporting them. This may reduce file size if you have a lot of elements on your pages.">
                                <FormControlLabel
                                    label="Flatten"
                                    control={<Switch value={flatten} onChange={(e, c) => setFlatten(c)} />}
                                />
                            </Tooltip>
                        </Stack>
                    </Stack>
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

                <SplitGroupAdder addGroup={addGroup} />

                {/* <JsonView data={environment} filter={["id", "label", "groups", "pages", "page", "name", "source"]} /> */}
            </Box>
        </DndProvider>
    );
}
