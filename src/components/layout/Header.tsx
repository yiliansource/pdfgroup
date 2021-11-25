import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";

import { config } from "src/lib/siteConfig";

export function Header() {
    return (
        <Box component="header" my={{ xs: 4, sm: 6 }}>
            <Stack direction="row" alignItems="center">
                <Box mx={2} sx={{ display: { xs: "none", sm: "block" } }}>
                    <Image src="/pdfgroup.svg" alt="pdfgroup Logo" height={82} width={82} draggable="false" />
                </Box>
                <Box>
                    <Typography variant="h2">{config.title}</Typography>
                    <Typography>{config.description}</Typography>
                </Box>
            </Stack>
        </Box>
    );
}
