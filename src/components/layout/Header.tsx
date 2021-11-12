import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export function Header() {
    return (
        <Box component="header" my={6}>
            <Typography variant="h2">pdfgroup</Typography>
            <Typography>Let&apos;s get started grouping some PDFs!</Typography>
        </Box>
    );
}
