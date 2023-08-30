import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback, useEffect } from "react";

export const useAtomSubscription = (anAtom, callback) => {
    const nonTrackingCallback = useAtomCallback(
        useCallback(
            (get, set, arg: unknown) => {
                callback(get, set, arg);
            },
            [callback],
        ),
    );
    const [value] = useAtom(anAtom);
    useEffect(() => {
        nonTrackingCallback(value);
    }, [nonTrackingCallback, value]);
};
