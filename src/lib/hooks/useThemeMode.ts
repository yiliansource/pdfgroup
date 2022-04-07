import { useTheme } from "@emotion/react";
import { PaletteMode, Theme } from "@mui/material";

export function useThemeMode(): PaletteMode {
    return (useTheme() as Theme).palette.mode;
}
