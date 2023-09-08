import { useCallback, useMemo, useRef } from "react";

export function useRefArray<T>(
    length: number,
    initialValue?: T | undefined,
): [refArray: T[], refCallbackAt: (index: number) => (node: T) => void] {
    const refs = useRef<T[] | null>(null);

    const getRefArray = useCallback(() => {
        if (refs.current === null) {
            refs.current = Array(length);
            if (initialValue !== undefined) {
                refs.current.fill(initialValue);
            }
        } else if (refs.current.length !== length) {
            const oldLength = refs.current.length;
            refs.current.length = length;
            if (initialValue !== undefined) {
                refs.current.fill(initialValue, oldLength);
            }
        }
        return refs.current;
    }, [initialValue, length]);

    const refArray = useMemo(() => getRefArray(), [getRefArray]);

    const refCallbackAt = useCallback(
        (index: number) => (node: T) => {
            const refArray = getRefArray();
            refArray[index] = node;
        },
        [getRefArray],
    );

    return [refArray, refCallbackAt];
}
