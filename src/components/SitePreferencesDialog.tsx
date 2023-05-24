import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Switch,
    TextField,
    Tooltip,
} from "@mui/material";
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
                        sx={{
                            mr: 2,
                        }}
                        primary="Default Group Name"
                        secondary="The default name that will be used for groups without specified names. Hover over the text field to see formatting placeholders."
                    />
                    <Tooltip
                        title="{index} for the index of the group. {count} for the number of pages in the group."
                        placement="top"
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={preferences.defaultGroupName}
                            sx={{
                                width: 500,
                            }}
                            onChange={(e) =>
                                setSettings((s) =>
                                    update(s, { preferences: { defaultGroupName: { $set: e.target.value } } })
                                )
                            }
                            InputProps={{
                                endAdornment: <InputAdornment position="end">.pdf</InputAdornment>,
                            }}
                        />
                    </Tooltip>
                </ListItem>
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
