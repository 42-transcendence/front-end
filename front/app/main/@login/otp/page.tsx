"use client";
import { userAgent } from "next/server";
import { useEffect, useRef } from "react";

// function VerificationCdeBlock() {
//     const inputRef = useRef(null);

//     useEffect(() => {

//     })

//     return (
//         <input ref={inputRef} className="VerificationCdeBlock"></input>
//     )
// }

export default function LoginPage() {
    return (
        <section>
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
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 items-center rounded opacity-80"
                        ></input>
                        <input
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 items-center rounded opacity-80"
                        ></input>
                        <input
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 items-center rounded opacity-80"
                        ></input>
                        <input
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 items-center rounded opacity-80"
                        ></input>
                        <input
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 items-center rounded opacity-80"
                        ></input>
                        <input
                            maxLength={1}
                            className="ultra-dark flex h-12 w-12 items-center rounded opacity-80"
                        ></input>
                    </div>
                </div>
            </div>
        </section>
    );
}
