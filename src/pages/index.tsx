import { Alert, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

import { SplitApp } from "src/components/SplitApp";
import { PdfSource } from "src/lib/pdf/file";
import { isIosChrome } from "src/lib/supports";

export interface UploadedFile {
    name: string;
    blob: ArrayBuffer;
}

export default function App() {
    const [source, setSource] = useState<PdfSource | null>(null);

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h2">pdfgroup</Typography>
                <Typography>Let&apos;s get started grouping some PDFs!</Typography>
            </Box>

            {isIosChrome() && (
                <Box mb={2}>
                    <Alert severity="error">
                        This application cannot download files in iOS Chrome. Please use a different browser.
                    </Alert>
                </Box>
            )}

            {/* TODO: Use FilePicker component instead of raw input. */}
            <input
                type="file"
                onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length < 1) return;

                    const file = files[0];
                    const source = await PdfSource.fromFile(file);

                    setSource(source);
                }}
            />
            {source && <SplitApp source={source} />}
        </Container>
    );
}
