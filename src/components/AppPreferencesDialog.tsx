import { Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemText, Switch } from "@mui/material";
import update from "immutability-helper";

import { useSettings } from "src/lib/hooks/useSettings";

export interface AppPreferencesDialogProps {
    open: boolean;

    onClose?(): void;
}

export function AppPreferencesDialog({ open, onClose }: AppPreferencesDialogProps) {
    const { preferences, modifySettings } = useSettings();

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Preferences</DialogTitle>
            <List>
                <ListItem>
                    <ListItemText primary="Dark Mode" secondary="Switches to the dark theme of the application." />
                    <Switch
                        edge="end"
                        checked={preferences.theme === "dark"}
                        onChange={(e, c) =>
                            modifySettings((s) => update(s, { preferences: { theme: { $set: c ? "dark" : "light" } } }))
                        }
                    />
                </ListItem>
            </List>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
