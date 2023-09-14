import { AccessTokenAtom, RefreshTokenAtom } from "@atoms/AccountAtom";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@utils/constants";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export function useToken() {
    const setAccessToken = useSetAtom(AccessTokenAtom);
    useEffect(() => {
        setAccessToken(window.localStorage.getItem(ACCESS_TOKEN_KEY));
        const handleAccessTokenEvent = (ev: StorageEvent) => {
            if (ev.storageArea === window.localStorage) {
                if (ev.key === null || ev.key === ACCESS_TOKEN_KEY) {
                    if (ev.oldValue !== ev.newValue) {
                        setAccessToken(ev.newValue);
                    }
                }
            }
        };
        window.addEventListener("storage", handleAccessTokenEvent);
        return () =>
            window.removeEventListener("storage", handleAccessTokenEvent);
    }, [setAccessToken]);

    const setRefreshToken = useSetAtom(RefreshTokenAtom);
    useEffect(() => {
        setRefreshToken(window.localStorage.getItem(REFRESH_TOKEN_KEY));
        const handleRefreshTokenEvent = (ev: StorageEvent) => {
            if (ev.storageArea === window.localStorage) {
                if (ev.key === null || ev.key === REFRESH_TOKEN_KEY) {
                    if (ev.oldValue !== ev.newValue) {
                        setRefreshToken(ev.newValue);
                    }
                }
            }
        };
        window.addEventListener("storage", handleRefreshTokenEvent);
        return () =>
            window.removeEventListener("storage", handleRefreshTokenEvent);
    }, [setRefreshToken]);
}
