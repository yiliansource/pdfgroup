/**
 * Removes the extension from the specified filename.
 *
 * @param filename The filename to remove the extension from.
 */
export function removeExtension(filename: string): string {
    return filename.split(".").slice(0, -1).join(".");
}

/**
 * Checks if the specified filename has one of the specified extensions, if provided.
 *
 * @param filename The name of the file to check.
 * @param extensions A comma-seperated list of file extensions to check (e.g. ".pdf,.png").
 */
export function hasExtension(filename: string, extensions?: string): boolean {
    return !extensions || extensions.split(",").some((ext) => filename.endsWith(ext));
}
