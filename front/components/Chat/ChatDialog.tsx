"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ImageLibrary";
import {
    // ChatBubble,
    // ChatBubbleRight,
    ChatBubbleWithProfile,
} from "./ChatBubble";
import { useWebSocket } from "@/library/react/websocket-hook";
import { ChatClientOpcode } from "@/library/payload/chat-opcodes";
import { readChatMessage } from "@/library/payload/chat-payloads";
import type { ChatMessageEntry, ChatRoomEntry } from "@/library/payload/chat-payloads";

const MIN_TEXTAREA_HEIGHT = 24;

function MessageInputArea() {
    const handleClick = () => {
        //TODO: create chatbubble with value
        console.log("heello");
    };
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");

    useLayoutEffect(() => {
        const element = textareaRef.current;

        if (element) {
            // Reset height - important to shrink on delete
            element.style.height = "inherit";
            // Set height
            element.style.height = `${Math.max(
                element.scrollHeight,
                MIN_TEXTAREA_HEIGHT,
            )}px`;
        }
    }, [value]);

    return (
        <>
            <textarea
                onChange={(event) => setValue(event.target.value)}
                rows={1}
                // autoFocus={true}
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
                <Icon.Send
                    className="rounded-md bg-transparent p-2 text-gray-300/50 transition-colors group-focus-within:bg-secondary/80 group-focus-within:text-white/80"
                    width={32}
                    height={32}
                />
            </button>
        </>
    );
}

// {{{
// const dummyChatMessages = [
//     {
//         msgId: BigInt(3),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "jkong",
//     },
//     {
//         msgId: BigInt(4),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "iyun",
//     },
//     {
//         msgId: BigInt(5),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "jkong",
//     },
//     {
//         msgId: BigInt(6),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "jkong",
//     },
//     {
//         msgId: BigInt(7),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "jkong",
//     },
//     {
//         msgId: BigInt(8),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "jkong",
//     },
//     {
//         msgId: BigInt(9),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "hdoo",
//     },
//     {
//         msgId: BigInt(10),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "chanhpar",
//     },
//     {
//         msgId: BigInt(11),
//         content: "lorem ipsum",
//         timestamp: new Date(),
//         sender: "chanhpar",
//     },
// ];
// }}}

const isSameMinute = (date1: Date, date2: Date) => {
    return new Date(date1).setSeconds(0, 0) === new Date(date2).setSeconds(0, 0);
};

const isContinuedMessage = (arr: ChatMessageEntry[], idx: number) => {
    return (
        idx > 0 &&
        arr[idx].memberUUID === arr[idx - 1].memberUUID &&
        isSameMinute(arr[idx].timestamp, arr[idx - 1].timestamp)
    );
};

export function ChatDialog({
    outerFrame,
    innerFrame,
}: {
    outerFrame: string;
    innerFrame: string;
}) {
    const [chatMessages, setChatMessages] = useState<ChatMessageEntry[]>([]);
    let chatRoomInfo : ChatRoomEntry ; // TODO: 인자로 받아오기
    const myUUID = "chanhpar"; // TODO: get my actual uuid

    useWebSocket("chat", ChatClientOpcode.CHAT_MESSAGE, (_, buffer) => {
        const chatMessageList = buffer.readArray(readChatMessage);
        setChatMessages(chatMessageList);
    });


    return (
        <div
            className={`${outerFrame} flex h-full shrink items-start justify-end gap-4 overflow-auto`}
        >
            <div
                className={`${innerFrame} flex h-full w-full flex-col justify-between gap-4 bg-black/30 p-4`}
            >
                <div className="flex flex-col gap-1 self-stretch overflow-auto">
                    {chatMessages.map((msg, idx, arr) => {
                        // TODO: key for ChatBubbleWithProfile
                        return (
                            <ChatBubbleWithProfile
                                key={idx}
                                chatMessage={msg}
                                isContinued={isContinuedMessage(arr, idx)}
                                dir={msg.memberUUID === myUUID ? "right" : "left"}
                            />
                        );
                    })}
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
