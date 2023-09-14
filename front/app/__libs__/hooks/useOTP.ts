import { useSWR, useSWRMutation } from "./useSWR";
import { useCallback } from "react";
import { HTTPError, fetchPromotionAuth, fetchToggle, fetcher } from "./fetcher";
import type { OTPSecret } from "@common/auth-payloads";
import { HTTPResponseCode } from "@utils/constants";

export function usePromotionOTP() {
    const callback = useCallback(
        async (_key: string, { arg }: { arg: string }) =>
            fetchPromotionAuth(arg),
        [],
    );
    const { trigger } = useSWRMutation("/auth/promotion", callback);
    return trigger;
}

export function useGetOTP() {
    const result = useSWR("/profile/private/otp", fetcher<OTPSecret>);

    const conflict =
        result.error instanceof HTTPError &&
        result.error.status === HTTPResponseCode.CONFLICT;
    return { data: result.data, conflict };
}

export function useToggleOTP(enable: boolean) {
    const callback = async (key: string, { arg }: { arg: string }) => {
        const params = new URLSearchParams();
        params.set("otp", arg);
        return await fetchToggle(key, params, enable);
    };
    const result = useSWRMutation("/profile/private/otp", callback, {
        throwOnError: false,
    });

    const error = result.error !== undefined;

    return { trigger: result.trigger, error, reset: result.reset };
}
