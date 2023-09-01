/**
 * Removes the extension from the specified filename.
 *
 * @param fileName The filename to remove the extension from.
 */
export function stripExtension(fileName: string): string {
    return fileName.split('.').slice(0, -1).join('.');
}

/**
 * Checks if the specified filename has one of the specified extensions, if provided.
 *
 * @param fileName The name of the file to check.
 * @param extensions A comma-seperated list of file extensions to check (e.g. ".pdf,.png").
 */
export function hasExtension(fileName: string, extensions: string): boolean {
    return extensions.split(',').some((ext) => fileName.endsWith(ext));
}

export function readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => resolve(reader.result as ArrayBuffer));
        reader.addEventListener('error', () => reject());

        reader.readAsArrayBuffer(file);
    });
}
