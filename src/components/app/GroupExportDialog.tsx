import DownloadIcon from "@mui/icons-material/Download";
import { LoadingButton } from "@mui/lab";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Switch,
} from "@mui/material";
import update from "immutability-helper";
import { useCallback, useState } from "react";

import { download } from "src/lib/helpers";
import { useGroupContext } from "src/lib/hooks/useGroupContext";
import { useSettings } from "src/lib/hooks/useSettings";

export interface GroupExportDialogProps {
    open: boolean;
    onClose?(): void;
}

/**
 * A dialog window that allows to export the environment to a file using options specified by the user.
 */
export function GroupExportDialog({ open, onClose }: GroupExportDialogProps) {
    const { environment } = useGroupContext();
    const { exportOptions, modifySettings } = useSettings();
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadHandler = useCallback(async () => {
        setIsDownloading(true);
        await download(environment, exportOptions);
        setIsDownloading(false);
        onClose?.();
    }, [environment, exportOptions, onClose]);

    const hasNoGroups = environment.groups.length === 0,
        hasEmptyGroups = environment.groups.some((g) => g.pages.length === 0),
        hasDuplicateNames = environment.groups.some(
            (g, i) => environment.groups.findIndex((f) => f.label === g.label) !== i
        );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Export Folder</DialogTitle>
            <DialogContent>
                {hasNoGroups && <Alert severity="error">There are no groups to export.</Alert>}
                {(hasEmptyGroups || hasDuplicateNames) && (
                    <Alert severity="warning" sx={{ mb: 1, ul: { p: "0 0 0 1em", m: 0, li: { mb: 0.5 } } }}>
                        <ul>
                            {hasEmptyGroups && <li>There are groups with no pages inside, these will be ignored.</li>}
                            {hasDuplicateNames && (
                                <li>There are groups with duplicate names, these will be ignored.</li>
                            )}
                        </ul>
                    </Alert>
                )}
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Flatten"
                            secondary="Renders the document pages to images before exporting them. This may reduce file size if you have a lot of elements on your pages."
                        />
                        <Switch
                            edge="end"
                            checked={exportOptions.flatten}
                            onChange={(e, c) =>
                                modifySettings((s) => update(s, { exportOptions: { flatten: { $set: c } } }))
                            }
                        />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadHandler}
                    loading={isDownloading}
                    disabled={environment.groups.length === 0}
                >
                    Export
                </LoadingButton>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
