"use client";

import { useEffect, useState } from "react";
import { DigitBlock } from "./DigitBlock";
import { useRefArray } from "@hooks/useRefArray";
import { useStateArray } from "@hooks/useStateArray";
import { usePromotionOTP, useToggleOTP } from "@hooks/useOTP";

export function OTPInputBlocks({ length }: { length: number }) {
    const [values, setValuesAt] = useStateArray(length, "");
    const [refArray, refCallbackAt] = useRefArray<HTMLInputElement | null>(
        length,
        null,
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        if (currentIndex >= refArray.length) {
            return;
        }

        const current = refArray[currentIndex];
        if (current === null) {
            throw new Error();
        }
        current.focus();
    }, [refArray, currentIndex]);
    const sendOTP = usePromotionOTP();
    useEffect(() => {
        if (currentIndex === values.length) {
            sendOTP(values.join(""))
                .then((r) => {
                    if (!r) {
                        throw new Error();
                    }
                })
                .catch(() => alert("코드를 다시 입력해 주세요."));
        }
    }, [sendOTP, values, currentIndex]);

    return refArray.map((_elem, index) => {
        return (
            <DigitBlock
                key={index - currentIndex}
                ref={refCallbackAt(index)}
                index={index}
                value={values[index]}
                setValue={setValuesAt(index)}
                disabled={index !== currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
        );
    });
}

export function OTPToggleBlocks({
    length,
    enable,
}: {
    length: number;
    enable: boolean;
}) {
    const [values, setValuesAt, clearValues] = useStateArray(length, "");
    const [refArray, refCallbackAt] = useRefArray<HTMLInputElement | null>(
        length,
        null,
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        if (currentIndex >= refArray.length) {
            return;
        }

        const current = refArray[currentIndex];
        if (current === null) {
            throw new Error();
        }
        current.focus();
    }, [refArray, currentIndex]);

    const { trigger: sendOTP, error, reset } = useToggleOTP(enable);
    useEffect(() => {
        if (currentIndex === values.length) {
            sendOTP(values.join(""))
                .then((r) => {
                    if (r !== undefined) {
                        alert("설정되었습니다");
                    }
                })
                .catch(() => {});
        }
    }, [currentIndex, sendOTP, values]);

    useEffect(() => {
        if (error) {
            clearValues();
            setCurrentIndex(0);
            reset();
        }
    }, [clearValues, error, reset]);

    return refArray.map((_elem, index) => {
        return (
            <DigitBlock
                key={index - currentIndex}
                ref={refCallbackAt(index)}
                index={index}
                value={values[index]}
                setValue={setValuesAt(index)}
                disabled={index !== currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
        );
    });
}
