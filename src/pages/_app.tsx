import { CacheProvider } from "@emotion/react";
import { EmotionCache } from "@emotion/utils";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import Layout from "src/components/Layout";
import createEmotionCache from "src/lib/styles/createEmotionCache";
import "src/styles/globals.css";

// Initialize the pdf.js worker via the appropriate CDN endpoint.
const pdfjs = require("pdfjs-dist/build/pdf");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

export default function MyApp({
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
}: MyAppProps): React.ReactElement {
    return (
        <CacheProvider value={emotionCache}>
            <CssBaseline />
            <Layout>
                <Head>
                    <title>pdfgroup</title>
                </Head>
                <Component {...pageProps} />
            </Layout>
        </CacheProvider>
    );
}
