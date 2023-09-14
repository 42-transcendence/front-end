"use client";

import { useEffect, useCallback } from "react";

export function useIntersectionObserver(
    callback: (target: Element) => void,
    targets: Map<string, Element> | Set<Element> | Element[],
    observerOptions: IntersectionObserverInit,
) {
    const handleIntersect: IntersectionObserverCallback = useCallback(
        (entries, _observer) => {
            entries
                .filter((entry) => entry.isIntersecting)
                .forEach((entry) => callback(entry.target));
        },
        [callback],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            handleIntersect,
            observerOptions,
        );

        for (const target of targets.values()) {
            observer.observe(target);
        }

        return () => observer.disconnect();
    }, [handleIntersect, observerOptions, targets]);
}
