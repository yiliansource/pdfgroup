import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, FormControl, IconButton, InputLabel, OutlinedInput, Stack, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import fileDialog from "file-dialog";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { environmentLabelAtom } from "src/lib/atoms/environmentLabelAtom";
import { isImportingAtom } from "src/lib/atoms/isImportingAtom";
import { useFileActions } from "src/lib/hooks/appActions";

import { SitePreferencesDialog } from "../SitePreferencesDialog";
import { ProgressOverlay } from "../util/ProgressOverlay";
import { GroupAdder } from "./GroupAdder";
import { GroupDragLayer } from "./GroupDragLayer";
import { GroupExportDialog } from "./GroupExportDialog";
import { GroupList } from "./GroupList";
import { GroupPageOverlayPreview } from "./GroupPageOverlayPreview";

// Initialize the pdf.js worker via the appropriate CDN endpoint.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfjs = require("pdfjs-dist/build/pdf");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * The main logic container for the splitting and grouping application.
 * This component handles the GroupEnvironment and manages it's state appropriately.
 */
export function GroupApp() {
    const [environmentLabel, setEnvironmentLabel] = useRecoilState(environmentLabelAtom);
    const [isPreferencesOpen, setPreferencesOpen] = useState<boolean>(false);
    const [isExportOpen, setExportOpen] = useState<boolean>(false);

    const isImporting = useRecoilValue(isImportingAtom);

    const fileActions = useFileActions();

    return (
        <>
            {/* We use a custom drag layer to display custom drag preview images for items. */}
            <GroupDragLayer />

            <SitePreferencesDialog open={isPreferencesOpen} onClose={() => setPreferencesOpen(false)} />
            <GroupExportDialog open={isExportOpen} onClose={() => setExportOpen(false)} />
            <ProgressOverlay open={isImporting} />
            <GroupPageOverlayPreview />

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
                                <InputLabel htmlFor="environment-label">Folder Name</InputLabel>
                                <OutlinedInput
                                    id="environment-label"
                                    value={environmentLabel}
                                    autoComplete="off"
                                    onChange={(e) => setEnvironmentLabel(e.target.value)}
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
                                        fileDialog({ accept: ".pdf", multiple: true }).then((files) =>
                                            fileActions.import(...files)
                                        )
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

                <GroupList />
                <GroupAdder />
            </Box>
        </>
    );
}
