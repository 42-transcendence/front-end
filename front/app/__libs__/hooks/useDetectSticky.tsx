import { useEffect, useRef, useState } from "react";

export function useDetectSticky<T extends HTMLElement>(): [
    isSticky: boolean,
    observeTarget: React.RefObject<T>,
    setIsSticky: React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [isSticky, setIsSticky] = useState(false);
    const ref = useRef<T>(null);

    // mount
    useEffect(() => {
        if (ref.current === null) {
            throw new Error();
        }
        const cachedRef = ref.current;
        const observer = new IntersectionObserver(
            ([e]) => {
                setIsSticky(e.intersectionRatio > 0 && e.intersectionRatio < 1);
            },
            { threshold: [1] },
        );

        observer.observe(cachedRef);

        // unmount
        return () => {
            observer.unobserve(cachedRef);
        };
    }, [ref]);

    return [isSticky, ref, setIsSticky];
}
