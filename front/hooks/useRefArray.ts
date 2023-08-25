import { useCallback, useMemo, useRef } from "react";

export function useRefArray<T>(
    length: number,
    initialValue?: T | undefined,
): [refArray: T[], refCallbackAt: (index: number) => (node: T) => void] {
    const refs = useRef<T[] | null>(null);

    const getRefArray = useCallback(() => {
        if (refs.current === null) {
            if (initialValue === undefined) {
                refs.current = new Array(length);
            } else {
                refs.current = Array(length).fill(initialValue);
            }
        }
        return refs.current;
    }, [initialValue, length]);

    const refCallbackAt = useCallback(
        (index: number) => (node: T) => {
            const refArray = getRefArray();
            refArray[index] = node;
        },
        [getRefArray],
    );

    const refArray = useMemo(() => getRefArray(), [getRefArray]);

    return [refArray, refCallbackAt];
}
