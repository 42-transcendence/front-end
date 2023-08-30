import { useCallback, useEffect } from "react";

export function useOutsideClick(
    ref: React.MutableRefObject<HTMLElement | null> | HTMLElement | null,
    callback: () => void,
    preventDefault: boolean,
) {
    const onClick = useCallback(
        (ev: MouseEvent) => {
            if (ev.defaultPrevented || ref === null) {
                return;
            }

            const target = ev.target;
            if (!(target instanceof Element)
                || !target.getRootNode().contains(target)
                || !target.isConnected
            ) {
                return;
            }

            const elem = (ref instanceof HTMLElement) ? ref : ref.current;
            if (elem === null) {
                return;
            }

            if (elem.contains(target)) {
                return;
            }

            callback();

            if (preventDefault) {
                ev.preventDefault();
            }
        },
        [callback, ref, preventDefault],
    );

    useEffect(() => {
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
        };
    }, [onClick]);
}
