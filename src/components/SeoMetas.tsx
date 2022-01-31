import { useTheme } from "@emotion/react";
import { Theme } from "@mui/material";
import getConfig from "next/config";

const { publicRuntimeConfig: config } = getConfig();

export function SeoMetas() {
    const theme = useTheme() as Theme;

    return (
        <>
            <title>{config?.title}</title>
            <meta name="description" content={config?.description} />
            <meta name="og:title" content={config?.title} />
            <meta name="og:type" content="website" />
            <meta name="og:description" content={config?.description} />
            <meta name="theme-color" content={theme.palette?.primary.main} />
        </>
    );
}
