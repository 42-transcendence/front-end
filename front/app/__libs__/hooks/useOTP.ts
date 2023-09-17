import { useSWR, useSWRMutation } from "./useSWR";
import { useCallback, useEffect } from "react";
import {
    HTTPError,
    fetchPromotionAuth,
    fetchMethod,
    fetcher,
    fetcherPOST,
} from "./fetcher";
import type { OTPSecret } from "@common/auth-payloads";
import { HTTPResponseCode } from "@utils/constants";
import { useSWRConfig } from "swr";

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
    const { data } = useSWR("/profile/private/otp", fetcher<string>);

    if (data === undefined) {
        return undefined;
    }
    return data === "true";
}

export function useGetInertOTP() {
    const result = useSWRMutation(
        "/profile/private/otp",
        fetcherPOST<OTPSecret>,
    );
    const { data, trigger } = result;
    useEffect(() => {
        void trigger();
    }, [trigger]);
    const conflict =
        result.error instanceof HTTPError &&
        result.error.status === HTTPResponseCode.CONFLICT;
    return { data, conflict };
}

export function useToggleOTP(enable: boolean) {
    const { mutate } = useSWRConfig();
    const callback = async (key: string, { arg }: { arg: string }) => {
        const searchParams = new URLSearchParams();
        searchParams.set("otp", arg);
        const result = await fetchMethod(
            `${key}?${searchParams.toString()}`,
            enable ? "PUT" : "DELETE",
        );
        void mutate("/profile/private/otp");
        return result;
    };
    const result = useSWRMutation("/profile/private/otp", callback, {
        throwOnError: false,
    });

    const error = result.error !== undefined;

    return { trigger: result.trigger, error, reset: result.reset };
}
