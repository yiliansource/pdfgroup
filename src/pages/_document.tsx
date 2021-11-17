/* eslint-disable */
import createEmotionServer from "@emotion/server/create-instance";
import Document, { Head, Html, Main, NextScript } from "next/document";
import type { DocumentContext, DocumentInitialProps } from "next/document";
import React from "react";

import createEmotionCache from "src/lib/styles/createEmotionCache";

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        // Enable SSR support for MUI (+Emotion).
        // See: https://mui.com/guides/server-rendering/

        const originalRenderPage = ctx.renderPage;

        const cache = createEmotionCache();
        const { extractCriticalToChunks } = createEmotionServer(cache);

        ctx.renderPage = () =>
            // @ts-ignore
            originalRenderPage({ enhanceApp: (App: () => any) => (props) => <App emotionCache={cache} {...props} /> });

        const initialProps = await Document.getInitialProps(ctx);

        const emotionStyles = extractCriticalToChunks(initialProps.html);
        const emotionStyleTags = emotionStyles.styles.map((style) => (
            <style
                data-emotion={`${style.key} ${style.ids.join(" ")}`}
                key={style.key}
                dangerouslySetInnerHTML={{ __html: style.css }}
            />
        ));

        return {
            ...initialProps,
            styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
        };
    }

    render(): JSX.Element {
        return (
            <Html lang="en">
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Inter:300,400,500,700&display=swap"
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@600&display=swap"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
