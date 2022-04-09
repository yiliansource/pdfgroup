import { CacheProvider } from "@emotion/react";
import type { EmotionCache } from "@emotion/utils";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import React, { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { RecoilRoot } from "recoil";

import { Layout } from "src/components/layout/Layout";
import { SeoMetas } from "src/components/util/SeoMetas";
import { SettingsAtomEffect } from "src/lib/atoms/settingsAtom";
import createEmotionCache from "src/lib/styles/createEmotionCache";
import { ThemeProvider } from "src/lib/styles/theme";
import { isTouch } from "src/lib/supports";

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
        <RecoilRoot>
            <SettingsAtomEffect />

            <DndProvider backend={touchBackend}>
                <CacheProvider value={emotionCache}>
                    <ThemeProvider>
                        <CssBaseline enableColorScheme />
                        <Layout>
                            <SeoMetas />
                            <Component {...pageProps} />
                        </Layout>
                    </ThemeProvider>
                </CacheProvider>
            </DndProvider>
        </RecoilRoot>
    );
}
