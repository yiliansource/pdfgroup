export function assertUnreachable(_: never): never {
    throw new Error('This should never happen.');
}
