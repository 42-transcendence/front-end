"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Game, Icon } from "@components/ImageLibrary";
import { ChatBubbleWithProfile, NoticeBubble } from "./ChatBubble";
import {
    extractTargetFromDirectChatKey,
    isDirectChatKey,
    type MessageSchema,
} from "@akasha-utils/idb/chat-store";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import type { ByteBuffer } from "@akasha-lib";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import {
    useChatRoomListAtom,
    useChatRoomMessages,
    useChatRoomMutation,
    useDirectRoomListAtom,
} from "@hooks/useChatRoom";
import { MessageTypeNumber } from "@common/generated/types";
import * as builder from "@akasha-utils/chat-payload-builder-client";
import { syncCursor, syncDirectCursor } from "@/app/(main)/ChatSocketProcessor";

const MIN_TEXTAREA_HEIGHT = 24;

function ChatMessageInputArea() {
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const currentChatRoomIsDirect = isDirectChatKey(currentChatRoomUUID);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");
    const { sendPayload } = useWebSocket("chat", []);

    const sendMessage = () => {
        if (value !== "") {
            let buf: ByteBuffer;
            if (currentChatRoomIsDirect) {
                buf = builder.makeSendDirectRequest(
                    extractTargetFromDirectChatKey(currentChatRoomUUID),
                    value,
                );
            } else {
                buf = builder.makeSendMessageRequest(
                    currentChatRoomUUID,
                    value,
                );
            }

            sendPayload(buf);
            setValue("");
        }
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

    const handleEnter: React.KeyboardEventHandler<HTMLTextAreaElement> = (
        event,
    ) => {
        if (event.key === "Enter") {
            if (event.shiftKey || event.nativeEvent.isComposing) {
                return;
            }
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="relative flex justify-center self-stretch">
            <div className="group relative flex w-full max-w-[640px] flex-shrink-0 items-center rounded-xl bg-black/30 px-4 py-2">
                <textarea
                    onKeyDown={handleEnter}
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
                <button type="button" onClick={() => sendMessage()}>
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
    const currentChatRoomIsDirect = isDirectChatKey(currentChatRoomUUID);
    const chatMessages = useChatRoomMessages(currentChatRoomUUID);
    const chatDialogRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { sendPayload } = useWebSocket("chat", []);
    const [, setChatRoomList] = useChatRoomListAtom();
    const [, setDirectRoomList] = useDirectRoomListAtom();
    const mutateChatRoom = useChatRoomMutation();
    const [lastMessage, setLastMessage] = useState<MessageSchema>();
    useEffect(() => {
        if (chatMessages !== undefined && chatMessages.length > 0) {
            const newLastMessage = chatMessages[chatMessages.length - 1];
            setLastMessage((lastMessage) =>
                lastMessage?.id !== newLastMessage.id
                    ? newLastMessage
                    : lastMessage,
            );
        }
    }, [chatMessages]);
    useEffect(() => {
        if (lastMessage !== undefined && currentChatRoomUUID !== "") {
            if (lastMessage.accountId === currentAccountUUID) {
                scrollToBottom();
            }

            let buf: ByteBuffer;
            if (currentChatRoomIsDirect) {
                setDirectRoomList((directRoomList) =>
                    syncDirectCursor(directRoomList, {
                        chatId: extractTargetFromDirectChatKey(
                            currentChatRoomUUID,
                        ),
                        messageId: lastMessage.id,
                    }),
                );
                buf = builder.makeSyncCursorDirect(
                    extractTargetFromDirectChatKey(currentChatRoomUUID),
                    lastMessage.id,
                );
            } else {
                setChatRoomList((chatRoomList) =>
                    syncCursor(chatRoomList, {
                        chatId: currentChatRoomUUID,
                        messageId: lastMessage.id,
                    }),
                );
                buf = builder.makeSyncCursor(
                    currentChatRoomUUID,
                    lastMessage.id,
                );
            }

            sendPayload(buf);
            mutateChatRoom(currentChatRoomUUID);
        }
    }, [
        currentAccountUUID,
        currentChatRoomIsDirect,
        currentChatRoomUUID,
        lastMessage,
        mutateChatRoom,
        sendPayload,
        setChatRoomList,
        setDirectRoomList,
    ]);

    const scrollToBottom = () => {
        if (messagesEndRef.current === null) {
            throw new Error();
        }
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    return currentChatRoomUUID !== "" ? (
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
                    {chatMessages?.map((msg, idx, arr) => {
                        if (
                            (msg.messageType as MessageTypeNumber) ===
                            MessageTypeNumber.NOTICE
                        ) {
                            return (
                                <NoticeBubble key={msg.id} chatMessage={msg} />
                            );
                        }

                        return (
                            <ChatBubbleWithProfile
                                key={msg.id}
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
                    <div ref={messagesEndRef} />
                </div>
                <ChatMessageInputArea />
            </div>
        </div>
    ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <span className="text-4xl text-gray-50/80">
                선택된 채팅창이 없습니다.
            </span>
            <Game.Ghost2 width="30%" height="30%" className="text-gray-50/80" />
        </div>
    );
}
