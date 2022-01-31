import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Paper,
    Switch,
    Typography,
} from "@mui/material";
import update from "immutability-helper";
import { useEffect, useState } from "react";

import logger from "src/lib/log";
import { ApplicationSettings } from "src/lib/settings";

export interface SplitAppSettingsProps {
    open: boolean;
    settings: ApplicationSettings;

    onSave?(settings: ApplicationSettings): void;
    onCancel?(): void;
}

export function SplitAppSettingsDialog({ open, settings: initialSettings, onSave, onCancel }: SplitAppSettingsProps) {
    const [settings, setSettings] = useState<ApplicationSettings>(null!);

    useEffect(() => {
        if (open) {
            setSettings(initialSettings);
        }
    }, [open, initialSettings]);

    if (!settings) return null;

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Application Settings</DialogTitle>
            <List subheader={<ListSubheader>Preferences</ListSubheader>}>
                <ListItem>
                    <ListItemText primary="Dark Mode" secondary="Switches to the dark theme of the application." />
                    <Switch
                        edge="end"
                        checked={settings.preferences.darkTheme}
                        onChange={(e, c) => setSettings((s) => update(s, { preferences: { darkTheme: { $set: c } } }))}
                    />
                </ListItem>
            </List>
            <List subheader={<ListSubheader>Export Settings</ListSubheader>}>
                <ListItem>
                    <ListItemText
                        primary="Flatten"
                        secondary="Renders the document pages to images before exporting them. This may reduce file size if you have a lot of elements on your pages."
                    />
                    <Switch
                        edge="end"
                        checked={settings.export.flatten}
                        onChange={(e, c) => setSettings((s) => update(s, { export: { flatten: { $set: c } } }))}
                    />
                </ListItem>
            </List>
            <DialogActions>
                <Button variant="contained" onClick={() => onSave?.(settings)}>
                    Save
                </Button>
                <Button variant="outlined" onClick={() => onCancel?.()}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
