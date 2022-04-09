import { RecoilValue, useRecoilValue } from "recoil";

interface RecoilValueDebugProps {
    value: RecoilValue<unknown>;
}
interface RecoilValueFamilyDebugProps<K> {
    valueKeys: RecoilValue<K[]>;
    value: (key: K) => RecoilValue<unknown>;
}
interface RecoilValueFamilyElementDebugProps<K> {
    valueKey: K;
    value: (key: K) => RecoilValue<unknown>;
}

export function RecoilValueDebug({ value }: RecoilValueDebugProps) {
    const state = useRecoilValue(value);
    return (
        <pre>
            <code>{formatDebugValue(state)}</code>
        </pre>
    );
}

export function RecoilValueFamilyDebug<K>({ valueKeys, value }: RecoilValueFamilyDebugProps<K>) {
    const keyValues = useRecoilValue(valueKeys);
    return (
        <>
            {keyValues.map((valueKey, i) => (
                <RecoilValueFamilyElementDebug key={i} valueKey={valueKey} value={value} />
            ))}
        </>
    );
}

export function RecoilValueFamilyElementDebug<K>({ valueKey, value }: RecoilValueFamilyElementDebugProps<K>) {
    const state = useRecoilValue(value(valueKey));
    return (
        <pre>
            <code>{`"${valueKey}" => ${formatDebugValue(state)}`}</code>
        </pre>
    );
}

function formatDebugValue(value: unknown): string {
    return JSON.stringify(value, null, 2);
}
