import {
    ChatClientOpcode,
    ChatServerOpcode,
} from "@/library/payload/chat-opcodes";
import type { ChatRoomChatMessagePairEntry } from "@/library/payload/chat-payloads";
import {
    readChatMessage,
    readChatRoom,
    writeChatRoomChatMessagePair,
} from "@/library/payload/chat-payloads";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@/library/react/websocket-hook";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AccessTokenAtom, CurrentAccountUUIDAtom } from "@/atom/AccountAtom";
import { ByteBuffer } from "@/library/akasha-lib";
import { ChatStore, MessageSchema } from "@/library/idb/chat-store";
import {
    ChatRoomListAtom,
    CurrentChatMessagesAtom,
    CurrentChatRoomUUIDAtom,
} from "@/atom/ChatAtom";

export function ChatSocketProcessor() {
    const accessToken = useAtomValue(AccessTokenAtom);
    const currentAccountUUID = useAtomValue(CurrentAccountUUIDAtom);
    const accessTokenRef = useRef(accessToken);
    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);
    const props = useMemo(
        () => ({
            handshake: async () => {
                const buf = ByteBuffer.createWithOpcode(
                    ChatServerOpcode.HANDSHAKE,
                );

                const roomSet = await ChatStore.getRoomSet(currentAccountUUID);
                const pairArray = new Array<ChatRoomChatMessagePairEntry>();
                if (roomSet !== null) {
                    for (const roomUUID of roomSet) {
                        const messageUUID =
                            await ChatStore.getFetchedMessageUUID(roomUUID);
                        if (messageUUID !== null) {
                            pairArray.push({ uuid: roomUUID, messageUUID });
                        }
                    }
                }
                buf.writeArray(pairArray, writeChatRoomChatMessagePair);
                return buf.toArray();
            },
        }),
        [currentAccountUUID],
    );
    const getURL = useCallback(
        () => `wss://back.stri.dev/chat?token=${accessTokenRef.current}`,
        [],
    );
    useWebSocketConnector("chat", getURL, props); //FIXME: props 이름?
    const [chatRoomList, setChatRoomList] = useAtom(ChatRoomListAtom);
    const currentChatRoomUUID = useAtomValue(CurrentChatRoomUUIDAtom);
    const [currentChatMessages, setCurrentChatMessages] = useAtom(
        CurrentChatMessagesAtom,
    );
    useWebSocket(
        "chat",
        [
            ChatClientOpcode.INITIALIZE,
            ChatClientOpcode.INSERT_ROOM,
            ChatClientOpcode.REMOVE_ROOM,
            ChatClientOpcode.CHAT_MESSAGE,
        ], // TODO recieve message -> insert to IDB
        async (opcode, buffer) => {
            switch (opcode) {
                case ChatClientOpcode.INITIALIZE: {
                    const chatRoomList = buffer.readArray(readChatRoom);
                    await Promise.allSettled(
                        chatRoomList.map((chatRoom) =>
                            ChatStore.addRoom(
                                currentAccountUUID,
                                chatRoom.uuid,
                                chatRoom.title,
                                chatRoom.modeFlags,
                            ),
                        ),
                    );
                    setChatRoomList(chatRoomList);
                    break;
                }

                case ChatClientOpcode.INSERT_ROOM: {
                    const chatRoom = readChatRoom(buffer);
                    await ChatStore.addRoom(
                        currentAccountUUID,
                        chatRoom.uuid,
                        chatRoom.title,
                        chatRoom.modeFlags,
                    );
                    setChatRoomList([...chatRoomList, chatRoom]);
                    break;
                }

                case ChatClientOpcode.REMOVE_ROOM: {
                    //TODO: 방 제외하기
                    break;
                }

                case ChatClientOpcode.CHAT_MESSAGE: {
                    const message = readChatMessage(buffer);
                    const success = await ChatStore.addMessage(
                        message.roomUUID,
                        message,
                    );

                    if (success && message.roomUUID === currentChatRoomUUID) {
                        setCurrentChatMessages([
                            ...currentChatMessages,
                            message,
                        ]);
                    }
                    break;
                }
            }
        },
    );
    return <></>;
}
