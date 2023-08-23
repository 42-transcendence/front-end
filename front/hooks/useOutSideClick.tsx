import { useCallback, useEffect } from "react";

export function useOutsideClick(
    divRef: React.RefObject<HTMLElement>,
    callback: () => void,
    preventDefault: boolean,
) {
    const onClick = useCallback(
        (e: MouseEvent) => {
            const elem = divRef.current;
            if (elem === null) {
                return;
            }

            const target = e.target;
            if (!(target instanceof Element)) {
                return;
            }
            if (elem.contains(target)) {
                return;
            }

            callback();
            preventDefault && e.preventDefault();
        },
        [callback, divRef, preventDefault],
    );

    useEffect(() => {
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
        };
    }, [onClick]);
}
