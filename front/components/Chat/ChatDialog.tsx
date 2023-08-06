"use client";
import React from "react";
import SendIcon from "/public/send.svg";
import { ChatBubble } from "./ChatBubble";

const MIN_TEXTAREA_HEIGHT = 24;

function MessageInputArea() {
    const handleClick = () => {
        //TODO: create chatbubble with value
        console.log("heello");
    };
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = React.useState("");
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
        setValue(event.target.value);

    React.useLayoutEffect(() => {
        // Reset height - important to shrink on delete
        textareaRef.current!.style.height = "inherit";
        // Set height
        textareaRef.current!.style.height = `${Math.max(
            textareaRef.current!.scrollHeight,
            MIN_TEXTAREA_HEIGHT,
        )}px`;
    }, [value]);

    return (
        <>
            <textarea
                onChange={onChange}
                rows={1}
                ref={textareaRef}
                style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    resize: "none",
                }}
                value={value}
                className="h-6 max-h-20 w-full flex-grow resize-none overflow-hidden bg-transparent font-sans text-base font-light text-white/80 outline-none focus:ring-0 focus-visible:ring-0"
            />
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
                className={`${rounded} flex h-full w-full flex-col items-start justify-end bg-black/30 p-4`}
            >
                <ChatBubble />
                {/* TODO: add 말풍선 */}
                <div className="flex flex-grow flex-col items-center justify-end self-stretch">
                    <div className="group flex w-full max-w-[640px] items-center rounded-xl bg-black/30 p-4">
                        <MessageInputArea />
                    </div>
                </div>
            </div>
        </div>
    );
}
