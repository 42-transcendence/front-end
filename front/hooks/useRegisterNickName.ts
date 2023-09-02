import { useAtomCallback } from "jotai/utils";
import { useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { HTTPError, fetcherPOST } from "./fetcher";
import { useSWRConfig } from "swr";
import { GlobalStore } from "@/atom/GlobalStore";

export function useRegisterNickName() {
    const { mutate } = useSWRConfig();
    const callback = useAtomCallback(
        useCallback(
            async (get, set, key: string, { arg }: { arg: string }) => {
                void (await fetcherPOST(get, set, key, { name: arg }));
                await mutate("/profile/private");
            },
            [mutate],
        ),
        { store: GlobalStore },
    );
    const result = useSWRMutation("/profile/nick", callback);
    const error = result.error !== undefined;
    const conflict =
        result.error instanceof HTTPError && result.error.status === 409;

    return { register: result.trigger, error, conflict };
}
