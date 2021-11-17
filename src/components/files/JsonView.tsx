export interface JsonViewProps<T = unknown> {
    /**
     * The data to render.
     */
    data: T;
    /**
     * How many spaces to use for indentation (default 2).
     */
    spaces?: number;
    /**
     * If provided, only shows properties with the specified keys.
     */
    filter?: string[];
}

/**
 * A JsonView dumps data into a JSON preview for debugging purposes.
 */
export function JsonView<T = unknown>({ data, spaces = 2, filter }: JsonViewProps<T>) {
    return (
        <pre>
            <code>{JSON.stringify(data, filter, spaces)}</code>
        </pre>
    );
}
