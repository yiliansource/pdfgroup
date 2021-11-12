export interface JsonViewProps<T = any> {
    data: T;
    spaces?: number;
    filter?: string[];
}

export function JsonView({ data, spaces = 2, filter }: JsonViewProps) {
    return (
        <pre>
            <code>{JSON.stringify(data, filter, spaces)}</code>
        </pre>
    );
}
