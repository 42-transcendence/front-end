import { useRef } from "react";

// TODO: need test. 안써봄 아직
export function useRefMap<T, V>(): [
    getRefMap: () => Map<T, V>,
    refCallback: (key: T) => (node: V | null) => void,
] {
    const refs = useRef<Map<T, V> | null>(null);

    const getRefMap = () => {
        if (refs.current === null) {
            refs.current = new Map();
        }
        return refs.current;
    };

    const refCallbackAt = (key: T) => (node: V | null) => {
        const refMap = getRefMap();
        if (node !== null) {
            refMap.set(key, node);
        } else {
            refMap.delete(key);
        }
    };

    return [getRefMap, refCallbackAt];
}
