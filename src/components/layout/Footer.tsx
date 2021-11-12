import { Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";

export function Footer() {
    return (
        <Box component="footer" py={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={14}>Copyright &copy; {new Date().getFullYear()} Ian Hornik</Typography>
                <Typography fontSize={14}>
                    <Link href="https://github.com/yiliansource/pdfgroup" target="_blank" rel="noopener">
                        GitHub
                    </Link>
                </Typography>
            </Stack>
        </Box>
    );
}
