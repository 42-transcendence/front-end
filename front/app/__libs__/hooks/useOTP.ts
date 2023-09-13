import { useSWR, useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { HTTPError, fetchPromotionAuth, fetchToggle, fetcher } from "./fetcher";
import { HTTP_RESPONSE_CONFLICT } from "./useRegisterNickName";
import type { OTPSecret } from "@common/auth-payloads";

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

export function useGetOTP() {
    const result = useSWR("/profile/private/otp", fetcher<OTPSecret>);

    const conflict =
        result.error instanceof HTTPError &&
        result.error.status === HTTP_RESPONSE_CONFLICT;
    return { data: result.data, conflict };
}

export function useToggleOTP(enable: boolean) {
    const callback = async (key: string, { arg }: { arg: string }) => {
        const params = new URLSearchParams();
        params.set("otp", arg);
        await fetchToggle(key, params, enable);
    };
    const { trigger } = useSWRMutation("/profile/private/otp", callback, {
        throwOnError: false,
    });
    return trigger;
}
