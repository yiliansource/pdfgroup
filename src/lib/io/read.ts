/**
 * Reads the specified file into an array buffer, asynchronously.
 */
export function readFile(file: File): Promise<ArrayBuffer | null> {
    return new Promise((resolve) => {
        const fr = new FileReader();
        fr.addEventListener("load", () => resolve(fr.result as ArrayBuffer));
        fr.readAsArrayBuffer(file);
        fr.addEventListener("error", () => resolve(null));
    });
}
