import { Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

/**
 * A general layouting component for the application.
 */
export function Layout({ children }: React.PropsWithChildren<unknown>) {
    return (
        <Container sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            <Footer />
        </Container>
    );
}
