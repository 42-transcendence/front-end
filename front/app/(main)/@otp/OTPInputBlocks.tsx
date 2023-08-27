"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DigitBlock } from "./DigitBlock";
import { useRefArray } from "@/hooks/useRefArray";
import { fetcher } from "@/hooks/fetcher";
import { hasProperty } from "@/library/akasha-lib";

// TODO: refactor, change mock functions to real function
export function OTPInputBlocks({ length }: { length: number }) {
    const initialValue = useMemo(
        () => Array<string>(length).fill(""),
        [length],
    );
    const [values, setValues] = useState(initialValue);
    const [refArray, refCallbackAt] = useRefArray<HTMLInputElement | null>(
        length,
        null,
    );

    const setValuesAt = (index: number) => (newValue: string) => {
        setValues(values.map((x, i) => (i === index ? newValue : x)));
    }; // TODO: rename

    const initialize = useCallback(() => {
        setValues(initialValue);
        const first = refArray[0];
        if (first !== null) {
            first.disabled = false;
            first.focus();
        }
    }, [refArray, initialValue]);

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

        //TODO: 같은 문서 안에서 바뀐건 스토리지 이벤트가 안날아감 홀리... Zustand가 필요할 때이다
        // const eventInitDict: StorageEventInit = {
        //     key: "access_token",
        //     newValue: json.access_token,
        //     storageArea: window.localStorage,
        // }
        // const eventThatNewlyMade = new StorageEvent("storage", eventInitDict);
        // window.dispatchEvent(eventThatNewlyMade);

       
    }, []);

    const failed = useCallback((error: unknown) => {
        // TODO: error ㅊㅓ리 어떻게?
        if (!(error instanceof Error)) {
            throw error;
        }
        // TODO: add animation for wrong OTP
        alert(`ERROR!! ${error.message}`);
    }, []);

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
