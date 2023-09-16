"use client";

import { useCallback, useState } from "react";

export function useCopyText(
    initial?: string | undefined,
): [text: string, setText: (x: string) => void, copyText: () => void] {
    const [text, setText] = useState(initial ?? "");

    const copyText = useCallback(() => {
        if (!window.isSecureContext) {
            alert("http로 연결 시에는 복사할 수 없습니다");
            return;
        }
        navigator.clipboard.writeText(text).catch(() => {});
    }, [text]);

    return [text, setText, copyText];
}
