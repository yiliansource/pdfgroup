export interface JSONViewProps<T = any> {
    data: T;
    spaces?: number;
    filter?: string[];
}

export function JSONView({ data, spaces = 2, filter }: JSONViewProps) {
    return (
        <pre>
            <code>{JSON.stringify(data, filter, spaces)}</code>
        </pre>
    );
}
