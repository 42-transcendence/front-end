import { useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { HTTPError, fetchPromotionAuth, fetcherPOST } from "./fetcher";
import { useSWRConfig } from "swr";

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

const HTTP_RESPONSE_CONFLICT = 409 as const;

export function useRegisterOTP() {
    const callback = async (key: string, { arg }: { arg: string }) => {
        void (await fetcherPOST(key, { otp: arg }));
    };
    const result = useSWRMutation("/profile/private/otp", callback, {
        throwOnError: false,
    });
    const error = result.error !== undefined;
    const conflict =
        result.error instanceof HTTPError &&
        result.error.status === HTTP_RESPONSE_CONFLICT;

    return { register: result.trigger, error, conflict };
}
