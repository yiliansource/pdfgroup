export interface JsonViewProps<T = any> {
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
export function JsonView<T = any>({ data, spaces = 2, filter }: JsonViewProps<T>) {
    return (
        <pre>
            <code>{JSON.stringify(data, filter, spaces)}</code>
        </pre>
    );
}
