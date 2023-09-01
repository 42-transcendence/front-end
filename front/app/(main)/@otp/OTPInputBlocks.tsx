"use client";

import { useCallback, useEffect } from "react";
import { DigitBlock } from "./DigitBlock";
import { useRefArray } from "@/hooks/useRefArray";
import { fetcher } from "@/hooks/fetcher";
import { hasProperty } from "@/library/akasha-lib";
import { useSetAtom } from "jotai";
import { AccessTokenAtom } from "@/atom/AccountAtom";
import { useStateArray } from "@/hooks/useStateArray";

export function OTPInputBlocks({ length }: { length: number }) {
    const [values, setValuesAt, initializeValues] = useStateArray(length, "");
    const [refArray, refCallbackAt] = useRefArray<HTMLInputElement | null>(
        length,
        null,
    );

    const initialize = useCallback(() => {
        initializeValues();
        const first = refArray[0];
        if (first !== null) {
            first.disabled = false;
            first.focus();
        }
    }, [initializeValues, refArray]);

    const setAccessToken = useSetAtom(AccessTokenAtom);
    const resolve = useCallback((json: unknown) => {
        if (typeof json !== "object" || json === null) {
            throw new Error();
        }

        if (!hasProperty("string", json, "access_token")) {
            throw new Error();
        }

        window.localStorage.setItem("access_token", json.access_token);

        if (hasProperty("string", json, "refresh_token")) {
            window.localStorage.setItem("refresh_token", json.refresh_token);
        } else {
            window.localStorage.removeItem("refresh_token");
        }

        setAccessToken(json.access_token);
    }, [setAccessToken]);

    const failed = useCallback((error: unknown) => {
        // TODO: error ㅊㅓ리 어떻게?
        if (!(error instanceof Error)) {
            throw error;
        }
        // TODO: add animation for wrong OTP
        alert(`ERROR!! ${error.message}`);
        window.localStorage.removeItem("refresh_token");

        setAccessToken(null);
    }, [setAccessToken]);

    // TODO: useSWR mutate 쓰기
    useEffect(() => {
        if (values.every((e) => e !== "")) {
            //TODO: 와... 이거 searchParams 어떻게 넘겨야 예쁘지?
            fetcher(`/auth/promotion?otp=${values.join("")}`)
                .then((response) => resolve(response))
                .catch((error) => failed(error))
                .finally(() => initialize());
        }
    }, [failed, initialize, length, resolve, values]);

    return refArray.map((_node, index) => {
        return (
            <DigitBlock
                key={index}
                index={index}
                refArray={refArray}
                ref={refCallbackAt(index)}
                value={values[index]}
                setValue={setValuesAt(index)}
            />
        );
    });
}
