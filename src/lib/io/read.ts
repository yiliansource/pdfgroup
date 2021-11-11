export function readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve) => {
        const fr = new FileReader();
        fr.addEventListener("load", () => resolve(fr.result as ArrayBuffer));
        // todo: error handling
        fr.readAsArrayBuffer(file);
    });
}
