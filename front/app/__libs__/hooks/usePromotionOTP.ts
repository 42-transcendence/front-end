import { useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { fetchPromotionAuth } from "./fetcher";

export function usePromotionOTP() {
    const callback = useCallback(
        async (_key: string, { arg }: { arg: string }) =>
            fetchPromotionAuth(arg),
        [],
    );
    // TODO: error 어떻게? throwOnError ? exception?
    const { trigger } = useSWRMutation("/auth/promotion", callback);
    return trigger;
}
