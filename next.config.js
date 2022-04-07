/* eslint-disable @typescript-eslint/no-var-requires */

const withInterceptStdout = require("next-intercept-stdout");

const { version } = require("./package.json");

/** @type {import('next').NextConfig} */
const config = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        version,
        title: "pdfgroup",
        description: "An application to split, group and organize your PDF documents.",
        githubUrl: "https://github.com/yiliansource/pdfgroup",
    },
};

module.exports = withInterceptStdout(config, (text) => (text.includes("Duplicate atom key") ? "" : text));
