"use client";
import { useEffect, useState, useRef } from "react";

const updateInputConfig = (element: HTMLInputElement, disabledStatus: boolean) => {
    element.disabled = disabledStatus;
    if (!disabledStatus) {
        element.focus();
    } else {
        element.blur();
    }
};

function VerificationCodeBlock({ length, inputCount, setInputCount, }) {
    const [value, setValue] = useState("");

    const childEventListener = (e) => {
        const replacedValue = e.target.value.replace(/[^0-9]/g, "").charAt(0);

        if (replacedValue.length === 1) {
            updateInputConfig(e.target, true);
            if (inputCount < length && e.key !== "Backspace") {
                if (inputCount < length - 1) {
                    updateInputConfig(e.target.nextElementSibling, false);
                }
            }
            setInputCount(inputCount + 1);
        } else if (replacedValue.length === 0 && e.key === "Backspace") {
            if (inputCount === 0) {
                updateInputConfig(e.target, false);
                return false;
            }
            updateInputConfig(e.target, true);
            e.target.previousElementSibling.value = "";
            updateInputConfig(e.target.previousElementSibling, false);
            setInputCount(inputCount - 1);
        }
    }

    return (
        <input
            onKeyUp={childEventListener}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete="one-time-code"
            disabled
            // value={value}
            className="ultra-dark flex appearance-none h-12 w-12 items-center rounded opacity-80"
        />
    )
}

function VerificationCodeBlocks({ length, }: { length: number, }) {

    const [inputCount, setInputCount] = useState(0);
    const parentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const windowEventListener = (e: any) => { //TODO keyup event type
            // TODO: for keyup event, is inputCount updated before this line?
            if (inputCount >= length) {
                alert("finalValue"); // TODO: submit value, validate
                if (e.key === "Backspace") {
                    const parentElement = parentRef.current;
                    const lastChild = parentElement?.lastElementChild;
                    if (lastChild) {
                        updateInputConfig(lastChild, false);
                        lastChild.value = "";
                        setInputCount(inputCount - 1);
                    }
                }
            }
        }

        window.addEventListener("keyup", windowEventListener);
        return () => {
            window.removeEventListener("keyup", windowEventListener);
        }
    }, [inputCount, length]);

    return (
        <div ref={parentRef} className="flex items-start gap-2 pt-14">
            <VerificationCodeBlock length={length} inputCount={inputCount} />
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
