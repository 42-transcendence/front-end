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
import { useMemo } from "react";
import { AccessTokenAtom, CurrentAccountUUIDAtom } from "@/atom/AccountAtom";
import { ByteBuffer } from "@/library/akasha-lib";
import { ChatStore } from "@/library/idb/chat-store";
import { ChatRoomListAtom } from "@/atom/ChatAtom";

export function ChatSocketProcessor() {
    const accessToken = useAtomValue(AccessTokenAtom);
    const currentAccountUUID = useAtomValue(CurrentAccountUUIDAtom);
    const props = useMemo(
        () => ({
            name: "chat",
            url: `wss://back.stri.dev/chat?token=${accessToken}`,
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
        [accessToken, currentAccountUUID],
    );
    useWebSocketConnector(props); //FIXME: props 이름?
    const [chatRoomList, setChatRoomList] = useAtom(ChatRoomListAtom);
    useWebSocket(
        "chat",
        [ChatClientOpcode.INITIALIZE, ChatClientOpcode.INSERT_ROOM],
        (opcode, buffer) => {
            switch (opcode) {
                case ChatClientOpcode.INITIALIZE: {
                    const chatRoomList = buffer.readArray(readChatRoom);
                    void Promise.allSettled(chatRoomList.map((chatRoom) => ChatStore.addRoom(currentAccountUUID, chatRoom.uuid, chatRoom.title, chatRoom.modeFlags)));
                    setChatRoomList(chatRoomList); //TODO: 도와줘 jotai!
                    break;
                }

                case ChatClientOpcode.INSERT_ROOM: {
                    const chatRoom = readChatRoom(buffer);
                    setChatRoomList([...chatRoomList, chatRoom]);
                    break;
                }
            }
        },
    );
    return <></>;
}
