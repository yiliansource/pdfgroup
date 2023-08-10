export function assertUnreachable(x: never): never {
    throw new Error("This should never happen.");
}
