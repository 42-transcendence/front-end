import {
    ChatClientOpcode,
    ChatServerOpcode,
} from "@/library/payload/chat-opcodes";
import type { ChatRoomChatMessagePairEntry } from "@/library/payload/chat-payloads";
import {
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
import { ChatStore } from "@/library/idb/chat-store";
import { ChatRoomListAtom } from "@/atom/ChatAtom";

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
    useWebSocket(
        "chat",
        [ChatClientOpcode.INITIALIZE, ChatClientOpcode.INSERT_ROOM], // TODO recieve message -> insert to IDB
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
                    setChatRoomList(chatRoomList); //TODO: 도와줘 jotai!
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
            }
        },
    );
    return <></>;
}
