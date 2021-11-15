import createCache from "@emotion/cache";

/**
 * Creates a new emotion cache, intended for styling usage.
 */
export default function createEmotionCache() {
    return createCache({ key: "css" });
}
