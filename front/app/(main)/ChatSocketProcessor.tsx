import {
    ChatClientOpcode,
    ChatServerOpcode,
} from "@/library/payload/chat-opcodes";
import type { ChatRoomChatMessagePairEntry } from "@/library/payload/chat-payloads";
import {
    readChatMessage,
    readChatRoom,
    readSocialPayload,
    writeChatRoomChatMessagePair,
} from "@/library/payload/chat-payloads";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@/library/react/websocket-hook";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AccessTokenAtom, CurrentAccountUUIDAtom } from "@/atom/AccountAtom";
import { ByteBuffer } from "@/library/akasha-lib";
import { ChatStore } from "@/library/idb/chat-store";
import {
    ChatRoomListAtom,
    CurrentChatMessagesAtom,
    CurrentChatRoomAtom,
    CurrentChatRoomUUIDAtom,
} from "@/atom/ChatAtom";
import {
    EnemyEntryAtom,
    FriendEntryAtom,
    FriendRequestEntryAtom,
} from "@/atom/FriendAtom";
import { mutate } from "swr";

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
    const setCurrentChatRoom = useSetAtom(CurrentChatRoomAtom);
    const currentChatRoomUUID = useAtomValue(CurrentChatRoomUUIDAtom);
    const [currentChatMessages, setCurrentChatMessages] = useAtom(
        CurrentChatMessagesAtom,
    );
    const [friendEntry, setFriendEntry] = useAtom(FriendEntryAtom);
    const [enemyEntry, setEnemyEntry] = useAtom(EnemyEntryAtom);
    const [friendRequestEntry, setFriendRequestEntry] = useAtom(
        FriendRequestEntryAtom,
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
                    const roomSet =
                        await ChatStore.getRoomSet(currentAccountUUID);
                    if (roomSet === null) {
                        throw new Error();
                    }

                    const chatRoomList = buffer.readArray(readChatRoom);
                    const promises = Array<Promise<boolean>>();
                    for (const room of chatRoomList) {
                        roomSet.delete(room.uuid);
                        promises.push(
                            ChatStore.addRoom(
                                currentAccountUUID,
                                room.uuid,
                                room.title,
                                room.modeFlags,
                            ),
                        );
                        promises.push(ChatStore.truncateMember(room.uuid));
                        for (const member of room.members) {
                            promises.push(
                                ChatStore.putMember(room.uuid, member),
                            );
                        }
                    }
                    for (const roomUUID of roomSet) {
                        promises.push(
                            ChatStore.deleteRoom(currentAccountUUID, roomUUID),
                        );
                    }

                    await Promise.allSettled(promises);

                    const chatMessageMapSize = buffer.readLength();
                    for (let i = 0; i < chatMessageMapSize; i++) {
                        const roomUUID = buffer.readUUID();
                        const messageList = buffer.readArray(readChatMessage);

                        await ChatStore.addMessageBulk(roomUUID, messageList);
                    }

                    setChatRoomList(chatRoomList);

                    const socialPayload = readSocialPayload(buffer);
                    setFriendEntry(socialPayload.friendList);
                    setFriendRequestEntry(socialPayload.friendRequestList);
                    setEnemyEntry(socialPayload.enemyList);

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
                    const roomUUID = buffer.readUUID();
                    console.log(currentChatRoomUUID, " 흠... ", roomUUID);
                    if (currentChatRoomUUID === roomUUID) {
                        setCurrentChatRoom("");
                    }
                    setChatRoomList(
                        chatRoomList.filter((e) => e.uuid != roomUUID),
                    );
                    await ChatStore.deleteRoom(currentAccountUUID, roomUUID);
                    break;
                }

                case ChatClientOpcode.CHAT_MESSAGE: {
                    const message = readChatMessage(buffer);
                    await ChatStore.addMessage(message.roomUUID, message);

                    if (message.roomUUID === currentChatRoomUUID) {
                        setCurrentChatMessages([
                            ...currentChatMessages,
                            message,
                        ]);
                    }

                    mutate(["ChatStore", message.roomUUID, "Count"]);
                    mutate(["ChatStore", message.roomUUID, "LatestMessage"]);
                    mutate(["ChatStore", message.roomUUID, "ModeFlags"]);
                    break;
                }
            }
        },
    );
    return <></>;
}
