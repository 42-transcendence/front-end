import { useAtomCallback } from "jotai/utils";
import { useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { fetchPromotionAuth } from "./fetcher";

export function usePromotionOTP() {
    const callback = useAtomCallback(
        useCallback(
            async (get, set, _key: string, { arg }: { arg: string }) => {
                return await fetchPromotionAuth(get, set, arg);
            },
            [],
        ),
    );
    const { trigger } = useSWRMutation("/auth/promotion", callback);
    return trigger;
}
