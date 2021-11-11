import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

import { SplitApp } from "src/components/SplitApp";
import { PdfSource } from "src/lib/pdf/file";

export interface UploadedFile {
    name: string;
    blob: ArrayBuffer;
}

export default function App() {
    const [source, setSource] = useState<PdfSource | null>(null);

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h2">splitpdf</Typography>
                <Typography>Let&apos;s get started splitting some PDFs!</Typography>
            </Box>
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
