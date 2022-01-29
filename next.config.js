// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("./package.json");

/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        version,
        title: "pdfgroup",
        description: "An application to split, group and organize your PDF documents.",
        githubUrl: "https://github.com/yiliansource/pdfgroup",
    },
};
