import {
    ChatClientOpcode,
    ChatServerOpcode,
} from "@/library/payload/chat-opcodes";
import type { ChatRoomChatMessagePairEntry } from "@/library/payload/chat-payloads";
import {
    readChatMessage,
    readChatRoom,
    readFriend,
    readSocialPayload,
    writeChatRoomChatMessagePair,
} from "@/library/payload/chat-payloads";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@/library/react/websocket-hook";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AccessTokenAtom } from "@/atom/AccountAtom";
import { ByteBuffer } from "@/library/akasha-lib";
import { ChatStore } from "@/library/idb/chat-store";
import { ChatRoomListAtom, CurrentChatRoomUUIDAtom } from "@/atom/ChatAtom";
import {
    EnemyEntryAtom,
    FriendEntryAtom,
    FriendRequestEntryAtom,
} from "@/atom/FriendAtom";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@/hooks/useCurrent";
import { useChatRoomMutation } from "@/hooks/useChatRoom";

export function ChatSocketProcessor() {
    const accessToken = useAtomValue(AccessTokenAtom);
    const currentAccountUUID = useCurrentAccountUUID();
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
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const [chatRoomList, setChatRoomList] = useAtom(ChatRoomListAtom);
    const mutateChatRoom = useChatRoomMutation();
    const setCurrentChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom);
    const [friendEntry, setFriendEntry] = useAtom(FriendEntryAtom);
    const [enemyEntry, setEnemyEntry] = useAtom(EnemyEntryAtom);
    const [friendRequestEntry, setFriendRequestEntry] = useAtom(
        FriendRequestEntryAtom,
    );
    useWebSocket("chat", undefined, async (opcode, buffer) => {
        switch (opcode) {
            case ChatClientOpcode.INITIALIZE: {
                const roomSet = await ChatStore.getRoomSet(currentAccountUUID);
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
                        promises.push(ChatStore.putMember(room.uuid, member));
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
                    const latestMessage =
                        await ChatStore.getLatestMessage(roomUUID);
                    if (latestMessage !== null) {
                        await ChatStore.setFetchedMessageUUID(
                            roomUUID,
                            latestMessage.uuid,
                        );
                    }
                }

                setChatRoomList(chatRoomList);

                const socialPayload = readSocialPayload(buffer);
                setFriendEntry(socialPayload.friendList);
                setFriendRequestEntry(socialPayload.friendRequestList);
                setEnemyEntry(socialPayload.enemyList);

                break;
            }

            case ChatClientOpcode.ADD_FRIEND_RESULT: {
                const errno = buffer.read1();
                if (errno === 0) {
                    const friend = readFriend(buffer);
                    setFriendEntry([...friendEntry, friend]);
                    setFriendRequestEntry(
                        friendRequestEntry.filter(
                            (accountUUID) => accountUUID !== friend.uuid,
                        ),
                    );
                } else {
                    console.log("ADD_FRIEND_RESULT에서 오류! " + errno);
                }
                break;
            }

            case ChatClientOpcode.DELETE_FRIEND_RESULT: {
                const friendUUID = buffer.readUUID();
                setFriendEntry(
                    friendEntry.filter((friend) => friend.uuid !== friendUUID),
                );
                setFriendRequestEntry(
                    friendRequestEntry.filter(
                        (accountUUID) => accountUUID !== friendUUID,
                    ),
                );
                break;
            }

            case ChatClientOpcode.FRIEND_REQUEST: {
                const targetUUID = buffer.readUUID();
                setFriendRequestEntry([...friendRequestEntry, targetUUID]);
                //TODO: 알림?
                break;
            }

            case ChatClientOpcode.UPDATE_FRIEND_ACTIVE_STATUS: {
                const targetUUID = buffer.readUUID();
                //FIXME: 해당 유저에 대한 activeStatus가 담긴 프로필 SWR revalidate
                break;
            }

            case ChatClientOpcode.INSERT_ROOM: {
                const chatRoom = readChatRoom(buffer);
                const messages = buffer.readArray(readChatMessage);
                await ChatStore.addRoom(
                    currentAccountUUID,
                    chatRoom.uuid,
                    chatRoom.title,
                    chatRoom.modeFlags,
                );
                await ChatStore.addMessageBulk(chatRoom.uuid, messages);
                setChatRoomList([...chatRoomList, chatRoom]);
                break;
            }

            case ChatClientOpcode.REMOVE_ROOM: {
                const roomUUID = buffer.readUUID();
                if (currentChatRoomUUID === roomUUID) {
                    setCurrentChatRoomUUID("");
                }
                setChatRoomList(
                    chatRoomList.filter((e) => e.uuid !== roomUUID),
                );
                await ChatStore.deleteRoom(currentAccountUUID, roomUUID);
                break;
            }

            case ChatClientOpcode.CHAT_MESSAGE: {
                const message = readChatMessage(buffer);
                await ChatStore.addMessage(message.roomUUID, message);

                mutateChatRoom(message.roomUUID);
                break;
            }

            //FIXME: ROOM_MEMBER 옵코드 처리
        }
    });
    return <></>;
}
