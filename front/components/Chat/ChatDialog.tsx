"use client";
import React from "react";
import SendIcon from "/public/send.svg";
import {
    ChatBubble,
    ChatBubbleRight,
    ChatBubbleWithProfile,
} from "./ChatBubble";

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
                autoFocus={true}
                ref={textareaRef}
                placeholder="Send a message"
                style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    resize: "none",
                }}
                value={value}
                className="relative h-6 max-h-20 min-h-fit w-full flex-grow resize-none overflow-hidden bg-transparent font-sans text-base font-light text-white/80 outline-none focus:ring-0 focus-visible:ring-0"
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
    outerFrame,
    innerFrame,
}: {
    outerFrame: string;
    innerFrame: string;
}) {
    return (
        <div
            className={`${outerFrame} flex h-full shrink items-start justify-end gap-4 overflow-auto`}
        >
            <div
                className={`${innerFrame} flex h-full w-full flex-col justify-between gap-4 bg-black/30 p-4`}
            >
                <div className="flex flex-col gap-1 self-stretch overflow-auto">
                    <ChatBubbleRight />
                    <ChatBubbleWithProfile isContinued={false} dir={"left"} />
                    <ChatBubbleWithProfile isContinued={true} />
                    <ChatBubbleWithProfile isContinued={true} />
                    <ChatBubbleWithProfile isContinued={true} />
                    <ChatBubbleWithProfile isContinued={true} />
                    <ChatBubbleWithProfile isContinued={true} />
                    <ChatBubbleWithProfile isContinued={true} />
                </div>
                {/* TODO: add 말풍선 */}
                <div className="relative flex justify-center self-stretch">
                    <div className="group relative flex w-full max-w-[640px] flex-shrink-0 items-center rounded-xl bg-black/30 px-4 py-2">
                        <MessageInputArea />
                    </div>
                </div>
            </div>
        </div>
    );
}
