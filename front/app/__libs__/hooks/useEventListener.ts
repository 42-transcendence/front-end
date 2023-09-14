import { useEffect } from "react";

export function useEventListener(event: string, callback: () => void) {
    useEffect(() => {
        document.addEventListener(event, callback);
        return () => document.removeEventListener(event, callback);
    }, [callback, event]);
}
