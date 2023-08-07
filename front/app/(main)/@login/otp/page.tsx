"use client";
import React from "react";
import { useState, useRef, } from "react";

function DigitBlock({
    prev,
    curr,
    next,
    value,
    setValue,
    onSubmit,
}: {
    prev: React.RefObject<HTMLInputElement> | null,
    curr: React.RefObject<HTMLInputElement>,
    next: React.RefObject<HTMLInputElement> | null,
    value: string,
    setValue: (value: string) => void,
    onSubmit?: () => void,
}) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentValue = value;

        const replacedValue = e.target.value.replace(/[^0-9]*/g, "")
        setValue(replacedValue);

        if (replacedValue !== "") {
            // e.target.blur();
            e.target.disabled = true;
            const nextNode = next?.current;
            if (nextNode) {
                nextNode.disabled = false;
                nextNode.focus();
            }
            if (onSubmit) {
                onSubmit();
            }
        } else if (currentValue !== "") {
            // e.target.blur();
        }
    };

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Backspace")
            return;
        const target = e.target as HTMLInputElement;
        if (target.value === "" && prev !== null) {
            target.disabled = true;
            const prevNode = prev?.current;
            if (prevNode) {
                prevNode.disabled = false;
                prevNode.focus();
            }
        }
    }

    // const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    //     e.target.select();
    // }

    // const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // e.target.disabled = true;
    // const nextNode = next.current;
    // if (nextNode) {
    //     nextNode.disabled = false;
    //     nextNode.focus();
    // }
    // }

    return (
        <input
            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
            inputMode="numeric"
            type="text"
            ref={curr}
            value={value}
            onChange={handleChange}
            onKeyDown={handleBackspace}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
            maxLength={1}
            disabled={prev !== null}
        />
    )
}

export default function LoginPage() {
    const [values, setValues] = useState(["", "", "", "", "", ""]);
    const [result, setResult] = useState("");

    const ref1 = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLInputElement>(null);
    const ref3 = useRef<HTMLInputElement>(null);
    const ref4 = useRef<HTMLInputElement>(null);
    const ref5 = useRef<HTMLInputElement>(null);
    const ref6 = useRef<HTMLInputElement>(null);

    const validateOTP = (otpValue: string) => {
        const resultValue = Number(otpValue);
        return (Number.isInteger(resultValue) && resultValue % 5 === 0)
    }

    const setValuesAt = (index: number) => (newValue: string) => {
        setValues(values.map((x, i) => i === index ? newValue : x));
    }

    const handleSubmit = () => {
        setResult(values.join(""));
        if (validateOTP(result))
            alert("correct");
        setValues(["", "", "", "", "", ""]);
        const first = ref1.current;
        if (first) {
            first.disabled = false;
            first.focus();
        }
    }

    return (
        <main>
            <div className="flex items-center justify-center">
                <div className="flex h-[124px] min-h-[100dvh] flex-col items-center justify-center self-stretch px-0 py-[9px]">
                    {/* text */}
                    <div className="flex h-10 w-[340px] shrink-0 flex-col justify-center text-center text-[32px] font-bold not-italic leading-8 text-black">
                        Verify your Number
                    </div>
                    <div className="flex h-[25px] shrink-0 flex-col justify-center self-stretch text-center text-xs font-bold not-italic leading-3 text-[color:var(--colors-gray,#98989D)]">
                        We sent a verfication code. Enter it below!
                    </div>
                    {/* verify code block*/}
                    {/* TODO: 나중에 컴포넌트로 빼야 함! 근데 생각해보니.. 굳이..? 6개밖에 안쓸텐데... 흠..*/}
                    <div className="flex items-start gap-2 pt-14">
                        <DigitBlock prev={null} curr={ref1} next={ref2} value={values[0]} setValue={setValuesAt(0)} />
                        <DigitBlock prev={ref1} curr={ref2} next={ref3} value={values[1]} setValue={setValuesAt(1)} />
                        <DigitBlock prev={ref2} curr={ref3} next={ref4} value={values[2]} setValue={setValuesAt(2)} />
                        <DigitBlock prev={ref3} curr={ref4} next={ref5} value={values[3]} setValue={setValuesAt(3)} />
                        <DigitBlock prev={ref4} curr={ref5} next={ref6} value={values[4]} setValue={setValuesAt(4)} />
                        <DigitBlock prev={ref5} curr={ref6} next={null} value={values[5]} setValue={setValuesAt(5)} onSubmit={handleSubmit} />
                    </div>
                    <p>{result}</p>
                </div>
            </div>
        </main>
    );
}
