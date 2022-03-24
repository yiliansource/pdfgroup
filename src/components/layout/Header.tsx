import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import getConfig from "next/config";
import Image from "next/image";

import PDFGroupLogo from "../../../public/pdfgroup.svg";

const { publicRuntimeConfig: config } = getConfig();

export function Header() {
    return (
        <Box component="header" my={{ xs: 4, sm: 6 }}>
            <Stack direction="row" alignItems="center">
                <Box mx={2} sx={{ display: { xs: "none", sm: "block" } }}>
                    <Image src={PDFGroupLogo} alt="pdfgroup Logo" height={82} width={82} draggable="false" priority />
                </Box>
                <Box>
                    <Typography variant="h2" display="inline-block">
                        {config?.title}
                    </Typography>
                    <Typography variant="body2" ml={1} display="inline-block">
                        v{config?.version}
                    </Typography>
                    <Typography variant="body1">{config?.description}</Typography>
                </Box>
            </Stack>
        </Box>
    );
}
