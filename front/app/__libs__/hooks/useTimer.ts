"use client";

import { useEffect, useRef, useState } from "react";

export function useTimer() {
    const start = useRef(Date.now());
    const [time, setTime] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(
            () => setTime(Date.now() - start.current),
            1000,
        );

        return () => clearInterval(intervalId);
    }, []);
    return Math.trunc(time / 1000);
}
