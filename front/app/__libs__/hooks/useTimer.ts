"use client";

import { useEffect, useRef, useState } from "react";

export function useTimer(start?: number | undefined) {
    const startRef = useRef(Date.now());
    useEffect(() => {
        if (start !== undefined) {
            startRef.current = start;
        }
    }, [start]);
    const [time, setTime] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(
            () => setTime(Date.now() - startRef.current),
            1000,
        );

        return () => clearInterval(intervalId);
    }, []);
    return Math.trunc(time / 1000);
}
