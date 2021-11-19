import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

import { SplitApp } from "src/components/SplitApp";
import { isIosChrome } from "src/lib/supports";

export default function Index() {
    return (
        <>
            {isIosChrome() && (
                <Box mb={2}>
                    <Alert severity="error">
                        This application cannot download files in iOS Chrome. Please use a different browser.
                    </Alert>
                </Box>
            )}

            <SplitApp />
        </>
    );
}
