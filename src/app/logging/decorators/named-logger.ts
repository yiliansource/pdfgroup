export const NAMED_LOGGER_SYMBOL = Symbol.for('NamedLoggerMarker');

let color = 0;
function nextLoggerColor(): number {
    color += 31;
    return color;
}

export function NamedLogger(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any): any => {
        target.prototype[NAMED_LOGGER_SYMBOL] = {
            name,
            color: nextLoggerColor(),
        };
        return target;
    };
}
