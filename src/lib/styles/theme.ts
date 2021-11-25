import "@mui/lab/themeAugmentation";
import { createTheme } from "@mui/material/styles";

/**
 * Creates the main theme used for the application.
 */
const theme = createTheme({
    palette: {
        // https://material.io/resources/color/
        primary: {
            main: "#CC4B4C",
            light: "#ff7c78",
            dark: "#951424",
        },
    },
});

export default theme;
