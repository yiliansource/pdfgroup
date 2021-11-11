export function isIosChrome(): boolean {
    if (typeof navigator === "undefined") return false;
    return /CriOS/i.test(navigator.userAgent) && /iphone|ipod|ipad/i.test(navigator.userAgent);
}

export function isTouch(): boolean {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
