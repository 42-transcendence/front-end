"use client";

import { useCallback, useState } from "react";

export function useCopyText(
    initial?: string | undefined,
): [text: string, setText: (x: string) => void, copyText: () => void] {
    const [text, setText] = useState(initial ?? "");

    const copyText = useCallback(() => {
        navigator.clipboard.writeText(text).catch(() => {});
    }, [text]);

    return [text, setText, copyText];
}
