"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ImageLibrary";
import { ChatBubbleWithProfile } from "./ChatBubble";
import { useAtomValue } from "jotai";
import { ChatStore } from "@/library/idb/chat-store";
import type { MessageSchema } from "@/library/idb/chat-store";
import { CurrentChatRoomUUIDAtom } from "@/atom/ChatAtom";
import { CurrentAccountUUIDAtom } from "@/atom/AccountAtom";
import { useWebSocket } from "@/library/react/websocket-hook";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { ByteBuffer } from "@/library/akasha-lib";

const MIN_TEXTAREA_HEIGHT = 24;

function ChatMessageInputArea({ chatRoomUUID, scrollToBottom }: { chatRoomUUID: string, scrollToBottom: () => void }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");
    const { sendPayload } = useWebSocket("chat", [])

    const handleClick: React.MouseEventHandler = (event) => {
        event.preventDefault();

        //TODO: create chatbubble with value

        const buf = ByteBuffer.createWithOpcode(ChatServerOpcode.CHAT_MESSAGE);
        buf.writeUUID(chatRoomUUID);
        buf.writeString(value);

        sendPayload(buf);
        setValue("");
        scrollToBottom();
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
        <>
            <textarea
                onChange={(event) => setValue(event.target.value)}
                rows={1}
                spellCheck="false"
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

const isSameMinute = (date1: Date, date2: Date) => {
    return (
        new Date(date1).setSeconds(0, 0) === new Date(date2).setSeconds(0, 0)
    );
};

const isContinuedMessage = (arr: MessageSchema[], idx: number) => {
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
    const [chatMessages, setChatMessages] = useState<MessageSchema[]>([]);
    const chatRoomUUID = useAtomValue(CurrentChatRoomUUIDAtom);
    const chatDialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ChatStore.getLastMessage(chatRoomUUID)
            .then((msg) =>
                msg === null
                    ? Promise.resolve(new Array<MessageSchema>())
                    : ChatStore.getBeforeMessages(chatRoomUUID, msg.uuid),
            )
            .then((arr) => setChatMessages(arr))
            .catch((error) => console.log(error));
    }, [chatRoomUUID]);

    const currentAccountUUID = useAtomValue(CurrentAccountUUIDAtom);

    const scrollToBottom = () => {
        const chatDialogElem = chatDialogRef.current;
        if (chatDialogElem === null) {
            throw new Error();
        }
        chatDialogElem.scrollTop = chatDialogElem.scrollHeight
    }

    return (
        <div
            className={`${outerFrame} flex h-full shrink items-start justify-end gap-4 overflow-auto`}
        >
            <div
                className={`${innerFrame} flex h-full w-full flex-col justify-between gap-4 bg-black/30 p-4`}
            >
                <div ref={chatDialogRef} className="flex flex-col gap-1 self-stretch overflow-auto">
                    {chatMessages.map((msg, idx, arr) => {
                        // TODO: key for ChatBubbleWithProfile with chat message UUID
                        return (
                            <ChatBubbleWithProfile
                                key={idx}
                                chatMessage={msg}
                                isContinued={isContinuedMessage(arr, idx)}
                                dir={
                                    msg.memberUUID === currentAccountUUID
                                        ? "right"
                                        : "left"
                                }
                            />
                        );
                    })}
                </div>

                <div className="relative flex justify-center self-stretch">
                    <div className="group relative flex w-full max-w-[640px] flex-shrink-0 items-center rounded-xl bg-black/30 px-4 py-2">
                        <ChatMessageInputArea chatRoomUUID={chatRoomUUID} scrollToBottom={scrollToBottom} />
                    </div>
                </div>
            </div>
        </div>
    );
}
