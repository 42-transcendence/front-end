"use client";

import { forwardRef } from "react";

export const DigitBlock = forwardRef(function DigitBlock(
    {
        index,
        value,
        setValue,
        disabled,
        setCurrentIndex,
    }: {
        index: number;
        value: string;
        setValue: (value: string) => void;
        disabled: boolean;
        setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    },
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const replacedValue = ev.target.value.replace(/[^0-9]*/g, "");
        setValue(replacedValue);
        if (replacedValue !== "") {
            setCurrentIndex((i) => i + 1);
        }
    };
    const handleBackspace = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === "Backspace") {
            if (index > 0) {
                setCurrentIndex((i) => i - 1);
            }
        }
    };

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
            disabled={disabled}
        />
    );
});
