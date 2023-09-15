"use client";

import { useEffect } from "react";

export function useAudio(src: string) {
    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = true;
        audio
            .play()
            .then(() => {})
            .catch(() => {});

        return () => audio.pause();
    }, [src]);
}
