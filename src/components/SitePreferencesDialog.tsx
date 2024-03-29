import { Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemText, Switch } from "@mui/material";
import update from "immutability-helper";
import { useRecoilState } from "recoil";

import { settingsAtom } from "src/lib/atoms/settingsAtom";

export interface SitePreferencesDialogProps {
    open: boolean;

    onClose?(): void;
}

export function SitePreferencesDialog({ open, onClose }: SitePreferencesDialogProps) {
    const [{ preferences }, setSettings] = useRecoilState(settingsAtom);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 0 }}>Preferences</DialogTitle>
            <List>
                <ListItem>
                    <ListItemText
                        primary="Dark Theme"
                        secondary="Enables or disables the dark theme of the application."
                    />
                    <Switch
                        edge="end"
                        checked={preferences.theme === "dark"}
                        onChange={(_, c) =>
                            setSettings((s) => update(s, { preferences: { theme: { $set: c ? "dark" : "light" } } }))
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
