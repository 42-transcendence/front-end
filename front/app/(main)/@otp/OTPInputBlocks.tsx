"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DigitBlock } from "./DigitBlock";
import { useRefArray } from "@/hooks/useRefArray";

const sleep = async (ms: number) => new Promise((res) => setTimeout(res, ms));
const validateOTP = async (otpValue: string) => {
    //TODO: 백에 갔다올동안 기다리기~
    await sleep(1);
    const resultValue = Number(otpValue);
    if (
        Number.isInteger(resultValue) &&
        resultValue > 0 &&
        resultValue % 5 === 0
    ) {
        return otpValue;
    } else {
        throw new Error("invalid otp");
    }
};

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
        if (first) {
            first.disabled = false;
            first.focus();
        }
    }, [refArray, initialValue]);

    const resolve = useCallback((value: string) => {
        alert(`correct ${value}`);
    }, []);

    useEffect(() => {
        if (length < 1) {
            return;
        }

        if (values[length - 1] !== "") {
            validateOTP(values.join(""))
                .then((r) => resolve(r))
                .catch((e) => console.log(e)) // TODO: add animation for wrong OTP
                .finally(() => initialize());
        }
    }, [initialize, length, resolve, values]);

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
