export const NAMED_LOGGER_SYMBOL = Symbol.for("NamedLoggerMarker");

let color: number = 0;
function nextLoggerColor(): number {
    color += 31;
    return color;
}

export function NamedLogger(name: string) {
    return (target: any): any => {
        target.prototype[NAMED_LOGGER_SYMBOL] = {
            name,
            color: nextLoggerColor(),
        };
        return target;
    };
}
