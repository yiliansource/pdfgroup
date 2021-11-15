/**
 * Represents the constant width of a rendered preview page, in pixels.
 */
export const PREVIEW_PAGE_WIDTH = 127;
/**
 * Represents the constant ratio between the height and width of an A4 page.
 */
export const PREVIEW_PAGE_RATIO = 1.4142;
/**
 * Represents the constant height of a rendered preview page, in pixels, determined via the width and size ratio.
 */
export const PREVIEW_PAGE_HEIGHT = Math.ceil(PREVIEW_PAGE_WIDTH * PREVIEW_PAGE_RATIO);
/**
 * Represents the constant spacing between preview pages, in pixels.
 */
export const PREVIEW_PAGE_SPACING = 8;
