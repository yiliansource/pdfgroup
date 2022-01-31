import { Backdrop, CircularProgress } from "@mui/material";

export interface ProgressOverlayProps {
    open: boolean;
}

export function ProgressOverlay({ open }: ProgressOverlayProps) {
    return (
        <Backdrop open={open} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
