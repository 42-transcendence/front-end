import { useRef } from "react";

export function useRefArray<T>(
    length: number,
    initialValue?: T | undefined
): [
        getRefArray: () => T[],
        refCallbackAt: (index: number) => (node: T) => void,
    ] {
    const refs = useRef<T[] | null>(null);

    const getRefArray = () => {
        if (refs.current === null) {
            if (initialValue === undefined) {
                refs.current = new Array(length);
            } else {
                refs.current = Array(length).fill(initialValue);
            }
        }
        return refs.current;
    };

    const refCallbackAt = (index: number) => (node: T) => {
        const refArray = getRefArray();
        refArray[index] = node;
    };

    return [getRefArray, refCallbackAt];
}
