import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

import { SplitApp } from "src/components/SplitApp";
import { FilePicker } from "src/components/files/FilePicker";
import { PdfSource } from "src/lib/pdf/file";
import { isIosChrome } from "src/lib/supports";

export interface UploadedFile {
    name: string;
    blob: ArrayBuffer;
}

export default function Index() {
    const [source, setSource] = useState<PdfSource | null>(null);

    return (
        <>
            {isIosChrome() && (
                <Box mb={2}>
                    <Alert severity="error">
                        This application cannot download files in iOS Chrome. Please use a different browser.
                    </Alert>
                </Box>
            )}

            {!source && (
                <FilePicker
                    accept=".pdf"
                    onChange={async (file) => {
                        setSource(await PdfSource.fromFile(file));
                    }}
                />
            )}
            {source && <SplitApp source={source} />}
        </>
    );
}
