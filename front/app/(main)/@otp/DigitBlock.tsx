import { isNonNullArray } from "@/utils/isNonNullArray";
import { forwardRef, useEffect } from "react";

export const DigitBlock = forwardRef(function DigitBlock(
    {
        index,
        refArray,
        value,
        setValue,
    }: {
        index: number;
        refArray: (HTMLInputElement | null)[];
        value: string;
        setValue: (value: string) => void;
    },
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const replacedValue = ev.target.value.replace(/[^0-9]*/g, "");
        setValue(replacedValue);

        if (replacedValue !== "") {
            ev.target.disabled = true;
            if (index < refArray.length - 1) {
                const nextElem = refArray[index + 1];
                if (nextElem !== null) {
                    nextElem.disabled = false;
                    nextElem.focus();
                }
            }
        }
    };

    const handleBackspace = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (!(ev.target instanceof HTMLInputElement)) return;

        const target = ev.target;
        if (ev.key === "Backspace") {
            if (index > 0) {
                target.disabled = true;
                const prevElem = refArray[index - 1];
                if (prevElem !== null) {
                    prevElem.disabled = false;
                    prevElem.focus();
                }
            }
        }
    };

    useEffect(() => {
        if (!isNonNullArray(refArray)) {
            throw new Error();
        }

        // FIXME: 이거 안전한가..? 아닌듯 검증..이 아니라 수정 필요. 살려줘요
        if (value !== "" && !refArray[index].disabled) {
            setValue("");
        }
    }, [index, setValue, refArray, value]);

    return (
        <input
            className="flex h-12 w-12 rounded text-center text-xl text-black caret-black outline-none"
            autoComplete="one-time-code"
            inputMode="numeric"
            type="text"
            ref={ref}
            value={value}
            onChange={handleChange}
            onKeyDown={handleBackspace}
            maxLength={1}
            disabled={index !== 0}
        />
    );
});
