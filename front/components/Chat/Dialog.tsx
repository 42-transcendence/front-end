"use client";
import React from "react";

function MessageInputArea() {
    const handleClick = () => {
        console.log("heello");
    };

    return (
        <>
            <textarea
                rows={1}
                className="h-fit max-h-20 w-full resize-none bg-transparent text-[22px] outline-none"
                placeholder="Send a message"
            />
            <button type="button" onClick={handleClick}>send</button>
        </>
    );
}

export function Dialog({ }): React.ReactElement {
    return (
        <div className="flex flex-[1_0_0%] flex-col items-start justify-end gap-4 self-stretch bg-white p-4 ">
            <div className="flex h-full w-full flex-[1_0_0%] flex-col items-center rounded-xl bg-black px-4 py-0">
                {/* TODO: add 말풍선 */}
            </div>
            <div className="flex flex-col items-center justify-center self-stretch">
                <div className="flex w-full max-w-[640px] flex-[1_0_0%] items-center rounded-xl bg-purple-800/30 px-5 py-0">
                    <MessageInputArea />
                </div>
            </div>
        </div>
    );
}
