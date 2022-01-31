import DownloadIcon from "@mui/icons-material/Download";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemText, Switch } from "@mui/material";
import update from "immutability-helper";
import { useCallback, useState } from "react";

import { download } from "src/lib/helpers";
import { useSettings } from "src/lib/hooks/useSettings";
import { useSplitContext } from "src/lib/hooks/useSplitContext";

export interface SplitExportDialogProps {
    open: boolean;

    onClose?(): void;
}

export function SplitExportDialog({ open, onClose }: SplitExportDialogProps) {
    const { environment } = useSplitContext();
    const { exportOptions, modifySettings } = useSettings();
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadHandler = useCallback(async () => {
        setIsDownloading(true);
        await download(environment, exportOptions);
        setIsDownloading(false);
        onClose?.();
    }, [environment, exportOptions, onClose]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Export Folder</DialogTitle>
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
            <DialogActions>
                <LoadingButton
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadHandler}
                    loading={isDownloading}
                >
                    Export
                </LoadingButton>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
