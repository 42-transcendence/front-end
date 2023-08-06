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
                id="prompt-textarea"
                tabIndex={0}
                data-id="root"
                rows={1}
                placeholder="Send a message"
                className="h-6 max-h-20 w-full resize-none bg-transparent font-sans text-[15px] text-base font-light text-white/80 outline-none"
            ></textarea>
            <button type="button" onClick={handleClick}>
                <SendIcon
                    className="text-gray-300/50"
                    width={20}
                    height="100%"
                />
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
}) {
    return (
        <div
            className={`${width} flex min-h-[200px] flex-auto flex-col items-start justify-end gap-4 self-stretch`}
        >
            <div
                className={`${rounded} flex h-full w-full flex-col items-center justify-end bg-black/30 p-4`}
            >
                {/* TODO: add 말풍선 */}
                <div className="flex flex-col items-center justify-center self-stretch">
                    <div className="flex w-full max-w-[640px] flex-[1_0_0%] items-center rounded-xl bg-black/30 p-4">
                        <MessageInputArea />
                    </div>
                </div>
            </div>
        </div>
    );
}
