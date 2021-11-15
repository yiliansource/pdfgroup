import "@mui/lab/themeAugmentation";
import { createTheme } from "@mui/material/styles";

/**
 * Creates the main theme used for the application.
 */
const theme = createTheme({
    palette: {
        primary: {
            main: "#3F3D56",
            light: "#6075A8",
            dark: "#3F3D56",
        },
        secondary: {
            main: "#F59999",
            light: "#F59999",
            dark: "#F59999",
            contrastText: "white",
        },
    },
});

export default theme;
