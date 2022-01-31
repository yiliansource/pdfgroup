import { Box } from "@mui/system";

import { PREVIEW_PAGE_HEIGHT, PREVIEW_PAGE_WIDTH } from "src/lib/constants";

/**
 * A placeholder that is rendered when dragging and before dropping a page item.
 */
export function PagePlaceholder() {
    return (
        <Box
            sx={{
                height: PREVIEW_PAGE_HEIGHT,
                width: PREVIEW_PAGE_WIDTH,
                borderRadius: 1,
                flex: `0 0 ${PREVIEW_PAGE_WIDTH}px`,
                border: "2px dashed #ccc",
            }}
        />
    );
}
