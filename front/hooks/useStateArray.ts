import { useState } from "react";

export function useStateArray<T>(
    length: number,
    initialValue?: T | undefined,
): [
    values: T[],
    setValueAt: (index: number) => (newValue: T) => void,
    initializeValues: () => void,
] {
    const initialArray =
        initialValue === undefined
            ? Array<T>(length)
            : Array<T>(length).fill(initialValue);
    const [values, setValues] = useState<T[]>(initialArray);

    const setValueAt = (index: number) => (newValue: T) => {
        setValues(values.map((x, idx) => (idx === index ? newValue : x)));
    };

    const initializeValues = () => setValues(initialArray);

    return [values, setValueAt, initializeValues];
}
