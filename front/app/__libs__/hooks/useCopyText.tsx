"use client";

import { useCallback, useState } from "react";

export function useCopyText(
    options: {
        initial?: string | undefined;
        onSuccess?: string | undefined;
        onFailure?: string | undefined;
    },
    timeOut = 1000
): [text: string, setText: (x: string) => void, copyText: () => void] {
    const [text, setText] = useState(options.initial ?? "");

    const copyText = useCallback(() => {
        const currentText = text;
        navigator.clipboard
            .writeText(text)
            .then(() => {
                if (options.onSuccess !== undefined) {
                    setText(options.onSuccess);
                }
            })
            .catch(() => {
                if (options.onFailure !== undefined) {
                    setText(options.onFailure);
                }
            });
        setTimeout(() => setText(currentText), timeOut);
    }, [options.onFailure, options.onSuccess, text, timeOut]);

    return [text, setText, copyText];
}

