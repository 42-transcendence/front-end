import { useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { HTTPError, fetcherPOST } from "./fetcher";
import { useSWRConfig } from "swr";

export function useRegisterNickName() {
    const { mutate } = useSWRConfig();
    const callback = useCallback(
        async (key: string, { arg }: { arg: string }) => {
            void (await fetcherPOST(key, { name: arg }));
            await mutate("/profile/private");
        },
        [mutate],
    );
    const result = useSWRMutation("/profile/nick", callback);
    const error = result.error !== undefined;
    const conflict =
        result.error instanceof HTTPError && result.error.status === 409;

    return { register: result.trigger, error, conflict };
}
