"use client";
import { useEffect, useState, useRef } from "react";

function VerificationCodeBlock({ ref, index, setSingleValue, setFocusIndex }: {
    ref: any, //TODO
    index: number,
    setSingleValue: (x: string) => void,
    setFocusIndex: (x: number) => void,
}) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("target value", e.target.value);
        const currentValue = e.target.value;
        const replacedValue = e.target.value.replace(/[^0-9.]/g, '');

        if (e.target.value.length === 0) {
            setSingleValue(replacedValue.charAt(0));
            setFocusIndex(index + 1);
        } else {
        }
    }

    const handleFocus = () => {
    }

    const handleBlur = () => {
    }

    return (
        <input
            onChange={handleChange}
            type="tel"
            maxLength={1}
            // value={value}
            className="ultra-dark flex appearance-none h-12 w-12 items-center rounded opacity-80"
        />
    )
}

function VerificationCodeBlocks({ length }: { length: number }) {
    const [values, setValues] = useState(new Array(length));
    const [focusIndex, setFocusIndex] = useState(-1);
    const childrenRef = useRef([]);

    const setSingleValue = (idx: number) => {
        return (x: string) => {
            const newValue = [...values];
            newValue[idx] = x;
            setValues(newValue);
        }
    }

    const children = [0, 1, 2, 3, 4, 5].map((x) => {
        return <VerificationCodeBlock ref={childrenRef.current[x]} index={x} setSingleValue={setSingleValue(x)} setFocusIndex={setFocusIndex} />
    });

    useEffect(() => {
        if (0 < focusIndex && focusIndex < length) {
            childrenRef.current[focusIndex].focus();
        }
    }, [focusIndex]);

    return (
        <div className="flex items-start gap-2 pt-14">
            {children}
        </div>
    );
}

export default function LoginPage() {
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
                    <VerificationCodeBlocks length={6} />
                </div>
            </div>
        </main>
    );
}
