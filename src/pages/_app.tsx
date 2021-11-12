import { CacheProvider } from "@emotion/react";
import { EmotionCache } from "@emotion/utils";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { Layout } from "src/components/layout/Layout";
import createEmotionCache from "src/lib/styles/createEmotionCache";
import { isTouch } from "src/lib/supports";
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
    const touchBackend = useMemo(() => (!isTouch() ? HTML5Backend : TouchBackend), []);

    return (
        <DndProvider backend={touchBackend}>
            <CacheProvider value={emotionCache}>
                <CssBaseline />
                <Layout>
                    <Head>
                        <title>pdfgroup</title>
                        <meta name="description" content="Let's get started grouping some PDFs!" />
                    </Head>
                    <Component {...pageProps} />
                </Layout>
            </CacheProvider>
        </DndProvider>
    );
}
