import { useSWR } from "./useSWR";
import { useCallback } from "react";
import { fetchBeginAuth } from "./fetcher";

export function useAuthBegin(endpointKey: string, endURL: string) {
    const callback = useCallback(
        async (_key: string) => {
            const redirectURL = new URL(endURL, window.location.origin);
            return await fetchBeginAuth(endpointKey, redirectURL.toString());
        },
        [endpointKey, endURL],
    );
    const { data } = useSWR("/auth/begin", callback);
    return data;
}
