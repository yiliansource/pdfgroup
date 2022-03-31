import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Collapse, FormControl, IconButton, InputLabel, OutlinedInput, Stack, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import fileDialog from "file-dialog";
import { useCallback, useState } from "react";
import { TransitionGroup } from "react-transition-group";

import {
    addGroup,
    importFile,
    moveGroup,
    movePage,
    removeGroup,
    removePage,
    renameEnvironment,
    renameGroup,
    toggleSelect,
} from "src/lib/helpers";
import { GroupContext } from "src/lib/hooks/useGroupContext";
import { GroupEnvironment, Page } from "src/lib/pdf/group";
import { PageLocation } from "src/lib/pdf/types";

import { SitePreferencesDialog } from "../SitePreferencesDialog";
import { ProgressOverlay } from "../util/ProgressOverlay";
import { GroupAdder } from "./GroupAdder";
import { GroupDragLayer } from "./GroupDragLayer";
import { GroupExportDialog } from "./GroupExportDialog";
import { GroupPageOverlayPreview } from "./GroupPageOverlayPreview";
import { GroupView } from "./GroupView";

// Initialize the pdf.js worker via the appropriate CDN endpoint.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfjs = require("pdfjs-dist/build/pdf");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * The main logic container for the splitting and grouping application.
 * This component handles the GroupEnvironment and manages it's state appropriately.
 */
export function GroupApp() {
    const [environment, setEnvironment] = useState<GroupEnvironment>(new GroupEnvironment("", []));
    const [inspectedPage, setInspectedPage] = useState<Page | null>(null);

    const [isImporting, setIsImporting] = useState(false);
    const [isExportOpen, setExportOpen] = useState(false);
    const [isPreferencesOpen, setPreferencesOpen] = useState(false);

    const importFileHandler = useCallback(
        async (file: File) => {
            setIsImporting(true);
            setEnvironment(await importFile(environment, file));
            setIsImporting(false);
        },
        [environment]
    );
    const renameEnvironmentHandler = (label: string) => {
        setEnvironment((e) => renameEnvironment(e, label));
    };
    const movePageHandler = (source: PageLocation, dest: PageLocation) => {
        setEnvironment((e) => movePage(e, source, dest));
    };
    const inspectPageHandler = useCallback(
        (location: PageLocation) => {
            setInspectedPage(environment.getPage(location));
        },
        [environment]
    );
    const removePageHandler = (location: PageLocation) => {
        setEnvironment((e) => removePage(e, location));
    };
    const moveGroupHandler = (sourceIndex: number, destIndex: number) => {
        setEnvironment((e) => moveGroup(e, sourceIndex, destIndex));
    };
    const addGroupHandler = (initial?: PageLocation) => {
        setEnvironment((e) => addGroup(e, initial));
    };
    const renameGroupHandler = (groupIndex: number, label: string) => {
        setEnvironment((e) => renameGroup(e, groupIndex, label));
    };
    const removeGroupHandler = (groupIndex: number) => {
        setEnvironment((e) => removeGroup(e, groupIndex));
    };
    const toggleSelectHandler = (location: PageLocation, selectionGroup?: number) => {
        setEnvironment((e) => toggleSelect(e, location, selectionGroup));
    }

    return (
        <GroupContext.Provider
            value={{
                environment,
                movePage: movePageHandler,
                inspectPage: inspectPageHandler,
                removePage: removePageHandler,
                moveGroup: moveGroupHandler,
                renameGroup: renameGroupHandler,
                removeGroup: removeGroupHandler,
                toggleSelect: toggleSelectHandler,
            }}
        >
            {/* We use a custom drag layer to display custom drag preview images for items. */}
            <GroupDragLayer />

            <SitePreferencesDialog open={isPreferencesOpen} onClose={() => setPreferencesOpen(false)} />
            <GroupExportDialog open={isExportOpen} onClose={() => setExportOpen(false)} />
            <ProgressOverlay open={isImporting} />
            <GroupPageOverlayPreview
                open={!!inspectedPage}
                page={inspectedPage || undefined}
                onClose={() => setInspectedPage(null)}
            />

            <Box pt={2} pb={16}>
                <Box mb={2}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={3}
                    >
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="document-title">Folder Name</InputLabel>
                                <OutlinedInput
                                    id="document-title"
                                    value={environment.label}
                                    autoComplete="off"
                                    onChange={(e) => renameEnvironmentHandler(e.target.value)}
                                    label="Folder Name"
                                />
                            </FormControl>

                            <Stack direction="row" spacing={1} height={56}>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => setExportOpen(true)}
                                >
                                    Export folder
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileUploadIcon />}
                                    onClick={() =>
                                        fileDialog({ accept: ".pdf" }).then((files) => importFileHandler(files[0]))
                                    }
                                >
                                    Import PDF
                                </Button>
                            </Stack>
                        </Stack>
                        <Stack alignSelf="flex-end">
                            <Tooltip title="Settings">
                                <IconButton onClick={() => setPreferencesOpen(true)}>
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </Box>

                <TransitionGroup>
                    {environment.groups.map((group, index) => (
                        <Collapse key={group.id}>
                            <Box mb={1}>
                                <GroupView group={group} groupIndex={index} totalGroups={environment.groups.length} />
                            </Box>
                        </Collapse>
                    ))}
                </TransitionGroup>

                <GroupAdder addGroup={addGroupHandler} importFile={importFileHandler} />
            </Box>
        </GroupContext.Provider>
    );
}
