import { forwardRef } from "react";

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
                if (nextElem) {
                    nextElem.disabled = false;
                    nextElem.focus();
                }
            }
        }
    };

    const handleBackspace = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key !== "Backspace") return;
        if (!(ev.target instanceof HTMLInputElement)) return;

        const target = ev.target;
        if (target.value === "") {
            if (index > 0) {
                target.disabled = true;
                const prevElem = refArray[index - 1];
                if (prevElem) {
                    prevElem.disabled = false;
                    prevElem.focus();
                }
            }
        }
    };

    return (
        <input
            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
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
