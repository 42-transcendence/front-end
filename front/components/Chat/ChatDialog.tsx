"use client";
import React, { useEffect, useState } from "react";
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
                    className="rounded-md bg-transparent p-2 text-gray-300/50 transition-colors group-focus-within:bg-secondary/80 group-focus-within:text-white/80"
                    width={32}
                    height={32}
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
                    <div className="group group flex w-full max-w-[640px] flex-[1_0_0%] items-center rounded-xl bg-black/30 p-4">
                        <MessageInputArea />
                    </div>
                </div>
            </div>
        </div>
    );
}

//absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple text-white bottom-1.5 transition-colors disabled:opacity-40
//absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple text-white bottom-1.5 transition-colors disabled:opacity-40
