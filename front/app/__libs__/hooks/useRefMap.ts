import { useCallback, useMemo, useRef } from "react";

export function useRefMap<T, V>(): [
    refMap: Map<T, V>,
    refCallback: (key: T) => (node: V | null) => void,
] {
    const refs = useRef<Map<T, V> | null>(null);

    const getRefMap = useCallback(() => {
        if (refs.current === null) {
            refs.current = new Map();
        }
        return refs.current;
    }, []);

    const refMap = useMemo(() => getRefMap(), [getRefMap]);

    const refCallbackAt = useCallback(
        (key: T) => (node: V | null) => {
            const refMap = getRefMap();
            if (node !== null) {
                refMap.set(key, node);
            } else {
                refMap.delete(key);
            }
        },
        [getRefMap],
    );

    return [refMap, refCallbackAt];
}
