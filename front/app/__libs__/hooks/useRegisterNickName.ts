import { useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { HTTPError, fetcherPOST } from "./fetcher";
import { useSWRConfig } from "swr";

// TODO: 나중에 http response constansts 파일로 빼기?
// 사실 제가 아직 status code 다 못외워서...
const HTTP_RESPONSE_CONFLICT = 409 as const;

export function useRegisterNickName() {
    const { mutate } = useSWRConfig();
    const callback = useCallback(
        async (key: string, { arg }: { arg: string }) => {
            void (await fetcherPOST(key, { name: arg }));
            await mutate("/profile/private");
        },
        [mutate],
    );
    const result = useSWRMutation("/profile/private/nick", callback, {
        throwOnError: false,
    });
    const error = result.error !== undefined;
    const conflict =
        result.error instanceof HTTPError &&
        result.error.status === HTTP_RESPONSE_CONFLICT;

    return { register: result.trigger, error, conflict };
}
