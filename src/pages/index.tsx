import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

import { GroupApp } from "src/components/app/GroupApp";
import { useClientOnly } from "src/lib/hooks/useClientOnly";
import { isIosChrome } from "src/lib/supports";

export default function Index() {
    const isClient = useClientOnly();

    return (
        <>
            {isClient && isIosChrome() && (
                <Box mb={2}>
                    <Alert severity="error">
                        This application cannot download files in iOS Chrome. Please use a different browser.
                    </Alert>
                </Box>
            )}

            <GroupApp />
        </>
    );
}
