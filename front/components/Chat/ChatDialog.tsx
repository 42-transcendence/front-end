"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ImageLibrary";
import { ChatBubbleWithProfile } from "./ChatBubble";
import type { MessageSchema } from "@/library/idb/chat-store";
import { useWebSocket } from "@/library/react/websocket-hook";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { ByteBuffer } from "@/library/akasha-lib";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@/hooks/useCurrent";
import { useChatRoomMessages } from "@/hooks/useChatRoom";

const MIN_TEXTAREA_HEIGHT = 24;

function ChatMessageInputArea() {
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");
    const { sendPayload } = useWebSocket("chat", []);

    const handleClick: React.MouseEventHandler = (event) => {
        event.preventDefault();

        const buf = ByteBuffer.createWithOpcode(ChatServerOpcode.SEND_MESSAGE);
        buf.writeUUID(currentChatRoomUUID);
        buf.writeString(value);

        sendPayload(buf);
        setValue("");
        event.currentTarget.scroll({ behavior: "smooth" }); //FIXME: 스크롤
    };

    useLayoutEffect(() => {
        const element = textareaRef.current;
        if (element === null) {
            throw new Error();
        }

        // Reset height - important to shrink on delete
        element.style.height = "inherit";
        // Set height
        element.style.height = `${Math.max(
            element.scrollHeight,
            MIN_TEXTAREA_HEIGHT,
        )}px`;
    }, [value]);

    return (
        <div className="relative flex justify-center self-stretch">
            <div className="group relative flex w-full max-w-[640px] flex-shrink-0 items-center rounded-xl bg-black/30 px-4 py-2">
                <textarea
                    onChange={(event) => setValue(event.target.value)}
                    rows={1}
                    spellCheck={false}
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
            </div>
        </div>
    );
}

const isSameMinute = (date1: Date, date2: Date) => {
    return (
        new Date(date1).setSeconds(0, 0) === new Date(date2).setSeconds(0, 0)
    );
};

const isContinuedMessage = (arr: MessageSchema[], idx: number) => {
    return (
        idx > 0 &&
        arr[idx].accountId === arr[idx - 1].accountId &&
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
    const currentAccountUUID = useCurrentAccountUUID();
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const chatMessages = useChatRoomMessages(currentChatRoomUUID) ?? [];
    const chatDialogRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className={`${outerFrame} flex h-full shrink items-start justify-end gap-4 overflow-auto`}
        >
            <div
                className={`${innerFrame} flex h-full w-full flex-col justify-between gap-4 bg-black/30 p-4`}
            >
                <div
                    ref={chatDialogRef}
                    className="flex flex-col gap-1 self-stretch overflow-auto"
                >
                    {chatMessages.map((msg, idx, arr) => {
                        // TODO: key for ChatBubbleWithProfile with chat message UUID
                        return (
                            <ChatBubbleWithProfile
                                key={idx}
                                chatMessage={msg}
                                isContinued={isContinuedMessage(arr, idx)}
                                dir={
                                    msg.accountId === currentAccountUUID
                                        ? "right"
                                        : "left"
                                }
                            />
                        );
                    })}
                </div>
                <ChatMessageInputArea />
            </div>
        </div>
    );
}
