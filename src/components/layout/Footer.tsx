import { Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import getConfig from "next/config";

const { publicRuntimeConfig: config } = getConfig();

export function Footer() {
    return (
        <Box component="footer" py={2}>
            <Stack direction="row" justifyContent="space-between">
                <Typography fontSize={14}>Copyright &copy; {new Date().getFullYear()} Ian Hornik</Typography>
                <Typography fontSize={14}>
                    <Link href={config?.githubUrl} target="_blank" rel="noopener">
                        GitHub
                    </Link>
                </Typography>
            </Stack>
        </Box>
    );
}
