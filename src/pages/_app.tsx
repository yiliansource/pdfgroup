import { CacheProvider } from "@emotion/react";
import { EmotionCache } from "@emotion/utils";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import React, { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { SeoMetas } from "src/components/SeoMetas";
import { Layout } from "src/components/layout/Layout";
import { SettingsProvider } from "src/lib/hooks/useSettings";
import createEmotionCache from "src/lib/styles/createEmotionCache";
import { ThemeProvider } from "src/lib/styles/theme";
import { isTouch } from "src/lib/supports";
import "src/styles/globals.css";

// Initialize the pdf.js worker via the appropriate CDN endpoint.
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
                <SettingsProvider>
                    <ThemeProvider>
                        <CssBaseline enableColorScheme />
                        <Layout>
                            <Head>
                                <SeoMetas />
                            </Head>
                            <Component {...pageProps} />
                        </Layout>
                    </ThemeProvider>
                </SettingsProvider>
            </CacheProvider>
        </DndProvider>
    );
}
