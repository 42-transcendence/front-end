"use client";
import { userAgent } from "next/server";
import {
    ChangeEventHandler,
    useState,
    useEffect,
    useRef,
    RefObject,
} from "react";

// function VerificationCdeBlock() {
//     const inputRef = useRef(null);

//     useEffect(() => {

//     })

//     return (
//         <input ref={inputRef} className="VerificationCdeBlock"></input>
//     )
// }
//
function useNextInputField(): [
    React.RefObject<HTMLInputElement>,
    string,
    React.ChangeEventHandler<HTMLInputElement>,
    ] {
    const ref = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");
    const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);

        if (e.target.value !== "") {
            ref.current?.focus();
        }
    };

    return [ref, value, handleInputValue];
}

export default function LoginPage() {
    const [ref1, value1, handleInputValue1] = useNextInputField();
    const [ref2, value2, handleInputValue2] = useNextInputField();
    const [ref3, value3, handleInputValue3] = useNextInputField();
    const [ref4, value4, handleInputValue4] = useNextInputField();
    const [ref5, value5, handleInputValue5] = useNextInputField();

    const [result, setResult] = useState("");
    // TODO: Send value to backend & remove result / replace to temp variable
    const [value6, setValue] = useState("");
    const handleInputValue6 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);

        if (e.target.value !== "") {
            setResult(
                [value1, value2, value3, value4, value5, e.target.value].join(
                    "",
                ),
            );
        }
    };

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
                        <input
                            value={value1}
                            onChange={handleInputValue1}
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
                        ></input>
                        <input
                            ref={ref1}
                            value={value2}
                            onChange={handleInputValue2}
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
                        ></input>
                        <input
                            ref={ref2}
                            value={value3}
                            onChange={handleInputValue3}
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
                        ></input>
                        <input
                            ref={ref3}
                            value={value4}
                            onChange={handleInputValue4}
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
                        ></input>
                        <input
                            ref={ref4}
                            value={value5}
                            onChange={handleInputValue5}
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
                        ></input>
                        <input
                            ref={ref5}
                            value={value6}
                            onChange={handleInputValue6}
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 rounded text-center opacity-80"
                        ></input>
                    </div>
                    <p>{result}</p>
                </div>
            </div>
        </main>
    );
}
