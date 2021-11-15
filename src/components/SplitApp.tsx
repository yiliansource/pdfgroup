import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { LoadingButton } from "@mui/lab";
import {
    Button,
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
import { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";

import { range } from "src/lib/collections";
import { removeExtension } from "src/lib/io/ext";
import { PdfSource } from "src/lib/pdf/file";
import { flattenDocument } from "src/lib/pdf/pipes/flattener";
import { SplitEnvironment, SplitGroup, SplitPage } from "src/lib/pdf/splitter";
import { PageLocation, PDFPipeMethod } from "src/lib/pdf/types";

import { SplitDragLayer } from "./SplitDragLayer";
import { SplitGroupAdder } from "./SplitGroupAdder";
import { SplitGroupView } from "./SplitGroupView";
import { JsonView } from "./files/JsonView";

export interface SplitterAppProps {
    /**
     * The PDF source file to use for the environment initialization.
     * Note that the component will be re-initialized if this changes.
     */
    source: PdfSource;
}

/**
 * The main logic container for the splitting and grouping application.
 * This component handles the SplitEnvironment and manages it's state appropriately.
 */
export function SplitApp({ source }: SplitterAppProps) {
    const [environment, setEnvironment] = useState<SplitEnvironment | null>(null);
    const [downloading, setDownloading] = useState(false);

    // TODO: Rewrite to proper "options" object once more options are provided.
    const [flatten, setFlatten] = useState(false);

    useEffect(() => {
        if (!source) return;

        (async function () {
            // Initialize the splitting environment using the provided PDF source.
            const document = await source.toPdflibDocument();
            const pageCount = document.getPageCount();
            const name = removeExtension(source.name);

            setEnvironment(
                new SplitEnvironment(name, [
                    new SplitGroup(
                        name,
                        range(0, pageCount).map((i) => new SplitPage(i, source))
                    ),
                ])
            );

            console.log("Initialized a new split environment.");
        })();
    }, [source]);

    if (!environment) return null;

    // TODO: Rewrite to useCallback methods?

    /**
     * Handler function to rename the environment to a specific string.
     *
     * @param label The string to rename the environment to.
     */
    const renameEnvironment = (label: string) => {
        setEnvironment((e) =>
            update(e, {
                label: { $set: label },
            })
        );
    };
    /**
     * Handler function to move a page from one location to another.
     * This method can be used to move a page to a different group, or re-arrange it in it's current group.
     *
     * @param source The current location of the page, used for indexing.
     * @param dest The desired location of the page, used for indexing.
     */
    const movePage = (source: PageLocation, dest: PageLocation) => {
        // If source and destination match, don't perform any movement.
        if (source.group === dest.group && source.page === dest.page) return;

        setEnvironment((e) => {
            // Determine the page instance to move around.
            const page = e!.getPage(source);

            return source.group === dest.group
                ? // If we need to move around the page inside it's current group, we use two splicing transactions
                  // on the same array. Note that the index is adjusted appropriately by the calling component.
                  update(e, {
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
    /**
     * Handler function to move a group to a specified destination index.
     *
     * @param sourceIndex The current location of the group.
     * @param destIndex The desired location of the group.
     */
    const moveGroup = (sourceIndex: number, destIndex: number) => {
        // If source and destination match, don't perform any movement.
        if (sourceIndex === destIndex) return;

        setEnvironment((e) => {
            // Determine the group to move.
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
    /**
     * Handler function to add a new group to the environment.
     * Optionally, an initial page can be specified to be immediately moved into the group.
     *
     * @param initial The (optional) initial page to populate the group with.
     */
    const addGroup = (initial?: PageLocation) => {
        setEnvironment((e) => {
            // TODO: Pick appropriate group label.
            const label = "";
            if (initial) {
                // Determine the page to move.
                const page = e!.getPage(initial);

                // Since we are moving a page around, we need to remove it from it's old location, before inserting
                // it into the new, created group.
                return update(e, {
                    groups: {
                        [initial.group]: { pages: { $splice: [[initial.page, 1]] } },
                        $push: [new SplitGroup(label, [page])],
                    },
                });
            } else {
                return update(e, {
                    groups: {
                        $push: [new SplitGroup(label)],
                    },
                });
            }
        });

        console.log(`Added a new group.`);
    };
    /**
     * Handler function to rename a specific group to a specific string.
     *
     * @param groupIndex The index of the group to rename.
     * @param label The string to rename the group to.
     */
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
    /**
     * Handler function to remove the group at the specified index.
     * Note that this simply removes it, without any warning or additional checks.
     *
     * @param groupIndex The index of the group to remove.
     */
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
    /**
     * Handler function to initiate the download of the environment.
     * This also prompts the save/download dialog.
     */
    const download = async () => {
        setDownloading(true);

        // Determine which pipes to use.
        const pipes: PDFPipeMethod[] = [];
        if (flatten) pipes.push(flattenDocument);

        await environment.save({ pipes });

        setDownloading(false);
    };

    return (
        <>
            {/* We use a custom drag layer to display custom drag preview images for items. */}
            <SplitDragLayer />

            <Box pt={2} pb={16}>
                <Box mb={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1}>
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

                            <Tooltip title="Coming soon!">
                                <span>
                                    <Button
                                        sx={{ height: "100%" }}
                                        variant="contained"
                                        startIcon={<FileUploadIcon />}
                                        disabled
                                    >
                                        Import PDF
                                    </Button>
                                </span>
                            </Tooltip>
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
        </>
    );
}
