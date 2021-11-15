/**
 * Creates a new range array, starting at "from" and going until "to" (non-inclusive).
 *
 * @param from The number to start from.
 * @param to The number to go to (non-inclusive).
 *
 * @returns A numeric array, starting at "from" and going until "to".
 */
export function range(from: number, to: number): number[] {
    if (from > to) throw new Error("Invalid range.");
    return Array.from(Array(to - from).keys()).map((i) => i + from);
}
