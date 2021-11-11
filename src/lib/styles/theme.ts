import "@mui/lab/themeAugmentation";
import { createTheme } from "@mui/material/styles";

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
    // components: {
    //     MuiButton: {
    //         defaultProps: {
    //             disableElevation: true,
    //         },
    //         styleOverrides: {
    //             root: {
    //                 borderRadius: "50px",
    //             },
    //         },
    //         variants: [
    //             {
    //                 props: { size: "small" },
    //                 style: {
    //                     padding: "4px 20px",
    //                 },
    //             },
    //             {
    //                 props: { size: "medium" },
    //                 style: {
    //                     padding: "6px 20px",
    //                 },
    //             },
    //             {
    //                 props: { size: "large" },
    //                 style: {
    //                     padding: "8px 30px",
    //                 },
    //             },
    //         ],
    //     },
    // },
});

export default theme;
