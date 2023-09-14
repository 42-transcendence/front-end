import { useCallback, useState } from "react";

export function useStateArray<T>(
    length: number,
    initialValue?: T | undefined,
): [
    values: T[],
    setValueAt: (index: number) => (newValue: T) => void,
    clearValues: () => void,
] {
    const [values, setValues] = useState<T[]>(() =>
        initialValue === undefined
            ? Array<T>(length)
            : Array<T>(length).fill(initialValue),
    );

    const setValueAt = (index: number) => (newValue: T) => {
        setValues(values.map((x, idx) => (idx === index ? newValue : x)));
    };

    const clearValues = useCallback(
        () =>
            setValues(() =>
                initialValue === undefined
                    ? Array<T>(length)
                    : Array<T>(length).fill(initialValue),
            ),
        [initialValue, length],
    );

    return [values, setValueAt, clearValues];
}
