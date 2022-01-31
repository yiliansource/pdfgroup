import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import {
    Backdrop,
    Button,
    Collapse,
    FormControl,
    IconButton,
    InputLabel,
    OutlinedInput,
    Stack,
    Tooltip,
} from "@mui/material";
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
} from "src/lib/helpers";
import { SplitContext } from "src/lib/hooks/useSplitContext";
import { SplitEnvironment, SplitPage } from "src/lib/pdf/splitter";
import { PageLocation } from "src/lib/pdf/types";

import { AppPreferencesDialog } from "./AppPreferencesDialog";
import { InspectedPagePreview } from "./InspectedPagePreview";
import { ProgressOverlay } from "./ProgressOverlay";
import { SplitDragLayer } from "./SplitDragLayer";
import { SplitExportDialog } from "./SplitExportDialog";
import { SplitGroupAdder } from "./SplitGroupAdder";
import { SplitGroupView } from "./SplitGroupView";

/**
 * The main logic container for the splitting and grouping application.
 * This component handles the SplitEnvironment and manages it's state appropriately.
 */
export function SplitApp() {
    const [environment, setEnvironment] = useState<SplitEnvironment>(new SplitEnvironment("", []));
    const [inspectedPage, setInspectedPage] = useState<SplitPage | null>(null);

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

    return (
        <SplitContext.Provider
            value={{
                environment,
                movePage: movePageHandler,
                inspectPage: inspectPageHandler,
                removePage: removePageHandler,
                moveGroup: moveGroupHandler,
                renameGroup: renameGroupHandler,
                removeGroup: removeGroupHandler,
            }}
        >
            {/* We use a custom drag layer to display custom drag preview images for items. */}
            <SplitDragLayer />

            <AppPreferencesDialog open={isPreferencesOpen} onClose={() => setPreferencesOpen(false)} />
            <SplitExportDialog open={isExportOpen} onClose={() => setExportOpen(false)} />
            <ProgressOverlay open={isImporting} />

            <Backdrop
                open={!!inspectedPage}
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                onClick={() => setInspectedPage(null)}
            >
                {/* TODO: Add loading indicator, either here, or in the preview. */}
                <InspectedPagePreview page={inspectedPage || undefined} />
            </Backdrop>

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
                                <SplitGroupView
                                    group={group}
                                    groupIndex={index}
                                    totalGroups={environment.groups.length}
                                />
                            </Box>
                        </Collapse>
                    ))}
                </TransitionGroup>

                <SplitGroupAdder addGroup={addGroupHandler} importFile={importFileHandler} />
            </Box>
        </SplitContext.Provider>
    );
}
