export function range(from: number, to: number): number[] {
    if (from > to) throw new Error("Invalid range.");
    return Array.from(Array(to - from).keys()).map((i) => i + from);
}
