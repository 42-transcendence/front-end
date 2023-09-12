"use client";

import { useEffect, useState } from "react";
import { DigitBlock } from "./DigitBlock";
import { useRefArray } from "@hooks/useRefArray";
import { useStateArray } from "@hooks/useStateArray";
import { usePromotionOTP } from "@hooks/useOTP";

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
            void sendOTP(values.join("")); // TODO: 틀리면 초기화
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
