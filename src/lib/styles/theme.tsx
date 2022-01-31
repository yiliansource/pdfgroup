import { ThemeProvider as MuiThemeProvider } from "@emotion/react";
import "@mui/lab/themeAugmentation";
import { GlobalStyles, PaletteMode, Theme } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";

import { useSettings } from "../hooks/useSettings";

export function getTheme(mode: PaletteMode): Theme {
    return createTheme({
        palette: {
            mode,
            // https://material.io/resources/color/
            primary: {
                main: "#cc4b4c",
                light: "#ff7c78",
                dark: "#951424",
            },
            ...(mode === "light"
                ? {}
                : {
                      background: {
                          default: grey[900],
                          paper: grey[900],
                      },
                  }),
        },
        components: {
            MuiAlert: {
                variants: [
                    {
                        props: { severity: "info" },
                        style: { background: "#265d84" },
                    },
                    {
                        props: { severity: "success" },
                        style: { background: "#295B40" },
                    },
                    {
                        props: { severity: "error" },
                        style: { background: "#842626" },
                    },
                    {
                        props: { severity: "warning" },
                        style: { background: "#96600E" },
                    },
                ],
            },
        },
    });
}

export function ThemeProvider({ children }: React.PropsWithChildren<unknown>) {
    const { preferences } = useSettings();
    const theme = useMemo(() => getTheme(preferences.theme), [preferences.theme]);

    return (
        <MuiThemeProvider theme={theme}>
            <GlobalStyles styles={{ body: { overflowY: "scroll" } }} />
            {children}
        </MuiThemeProvider>
    );
}
