/**
 * This file is used to store browser-support guards. These should only be used to guard for environment-specific
 * features, and not as a general-purpose way to customize, for example, browser appearance.
 */

/**
 * Tests if the current browser (user agent) is specified as Chrome on iOS.
 */
export function isIosChrome(): boolean {
    if (typeof navigator === "undefined") return false;
    return /CriOS/i.test(navigator.userAgent) && /iphone|ipod|ipad/i.test(navigator.userAgent);
}

/**
 * Tests if the device of the browser supports touch actions.
 */
export function isTouch(): boolean {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
