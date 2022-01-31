import { useTheme } from "@emotion/react";
import { Theme } from "@mui/material";
import getConfig from "next/config";
import Head from "next/head";

const { publicRuntimeConfig: config } = getConfig();

/**
 * A utility component that adds SEO related metadata to the site's head.
 */
export function SeoMetas() {
    const theme = useTheme() as Theme;

    return (
        <Head>
            <title>{config?.title}</title>
            <meta name="description" content={config?.description} />
            <meta name="og:title" content={config?.title} />
            <meta name="og:type" content="website" />
            <meta name="og:description" content={config?.description} />
            <meta name="og:image" content="/pdfgroup.svg" />
            <meta name="theme-color" content={theme.palette?.primary.main} />
        </Head>
    );
}
