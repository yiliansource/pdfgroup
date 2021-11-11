export function removeExtension(filename: string): string {
    return filename.split(".").slice(0, -1).join(".");
}
