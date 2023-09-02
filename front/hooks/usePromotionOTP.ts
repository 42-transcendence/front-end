import { useAtomCallback } from "jotai/utils";
import { useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { fetchPromotionAuth } from "./fetcher";
import { GlobalStore } from "@/atom/GlobalStore";

export function usePromotionOTP() {
    const callback = useAtomCallback(
        useCallback(
            async (get, set, _key: string, { arg }: { arg: string }) => {
                return await fetchPromotionAuth(get, set, arg);
            },
            [],
        ),
        { store: GlobalStore },
    );
    const { trigger } = useSWRMutation("/auth/promotion", callback);
    return trigger;
}
