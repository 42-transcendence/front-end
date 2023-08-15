"use client";

import { useState, useEffect } from "react";

export function TimeoutWrapper({
    children,
    milliseconds,
}: React.PropsWithChildren<{
    milliseconds: number
}>) {
    const [state, changeState] = useState(true);

    useEffect(() => {
        const id = setTimeout(() => changeState(false), milliseconds);
        return () => clearTimeout(id);
    }, [milliseconds]);

    return (
        <>
            {state ? children : null}
        </>
    );
}
