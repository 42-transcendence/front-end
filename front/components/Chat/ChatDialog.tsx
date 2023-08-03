"use client";
import React from "react";
import SendIcon from "/public/send.svg";

function MessageInputArea() {
    const handleClick = () => {
        console.log("heello");
    };

    return (
        <>
            <textarea
                rows={1}
                className="h-fit max-h-20 w-full resize-none justify-center bg-transparent text-[15px] outline-none"
                placeholder="Send a message"
            />
            <button type="button" onClick={handleClick}>
                <SendIcon className="text-gray-400" width={20} height="100%" />
            </button>
        </>
    );
}

export function ChatDialog({
    rounded,
    width,
}: {
    rounded: string;
    width: string;
}): React.ReactElement {
    return (
        <div
            className={`${width} flex min-h-[200px] flex-[1_0_0%] flex-col items-start justify-end gap-4 self-stretch`}
        >
            <div
                className={`${rounded} flex h-full w-full flex-[1_0_0%] flex-col items-center justify-end bg-black/30 p-4`}
            >
                {/* TODO: add 말풍선 */}
                <div className="flex flex-col items-center justify-center self-stretch">
                    <div className="flex w-full max-w-[640px] flex-[1_0_0%] items-center rounded-xl bg-black/30 px-5 py-0">
                        <MessageInputArea />
                    </div>
                </div>
            </div>
        </div>
    );
}
