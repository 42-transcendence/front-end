/* eslint-disable @typescript-eslint/unbound-method */
import { ChatClientOpcode, ChatServerOpcode } from "@common/chat-opcodes";
import type { ChatRoomChatMessagePairEntry } from "@common/chat-payloads";
import {
    SocialErrorNumber,
    readChatBanSummary,
    readChatDirect,
    readChatMessage,
    readChatRoom,
    readChatRoomChatMessagePair,
    readChatRoomView,
    readEnemy,
    readFriend,
    readSocialPayload,
    toChatRoomModeFlags,
    writeChatRoomChatMessagePair,
} from "@common/chat-payloads";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@akasha-utils/react/websocket-hook";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { ByteBuffer } from "@akasha-lib";
import { ChatStore, makeDirectChatKey } from "@akasha-utils/idb/chat-store";
import { ChatRoomListAtom, CurrentChatRoomUUIDAtom } from "@atoms/ChatAtom";
import {
    EnemyEntryListAtom,
    FriendEntryListAtom,
    FriendRequestListAtom,
} from "@atoms/FriendAtom";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import { useChatRoomMutation } from "@hooks/useChatRoom";
import { ACCESS_TOKEN_KEY } from "@hooks/fetcher";

function handleFriendSocialError(errno: SocialErrorNumber) {
    let message = "";
    switch (errno) {
        case SocialErrorNumber.ERROR_ALREADY_EXISTS:
            message = "이미 친구로 추가되어 있습니다.";
            break;
        case SocialErrorNumber.ERROR_NOT_FOUND:
            message = "친구 목록에서 찾을 수 없습니다.";
            break;
        case SocialErrorNumber.ERROR_DENIED:
            message = "상대방에게 차단당했습니다.";
            break;
        case SocialErrorNumber.ERROR_SELF:
            message = "나 자신은 영원한 인생의 친구입니다";
            break;
        case SocialErrorNumber.ERROR_LOOKUP_FAILED:
            message = "해당하는 닉네임을 찾지 못했습니다.";
            break;
        case SocialErrorNumber.ERROR_UNKNOWN:
            message = "알 수 없는 오류로 실패했습니다.";
            break;
        default:
            break;
    }
    if (message !== "") {
        alert(message);
    }
}

function handleEnemySocialError(errno: SocialErrorNumber) {
    let message = "";
    switch (errno) {
        case SocialErrorNumber.ERROR_ALREADY_EXISTS:
            message = "이미 친구로 추가되어 있습니다.";
            break;
        case SocialErrorNumber.ERROR_NOT_FOUND:
            message = "친구 목록에서 찾을 수 없습니다.";
            break;
        case SocialErrorNumber.ERROR_DENIED:
            message = "상대방에게 차단당했습니다.";
            break;
        case SocialErrorNumber.ERROR_SELF:
            message = "나 자신은 영원한 인생의 친구입니다";
            break;
        case SocialErrorNumber.ERROR_LOOKUP_FAILED:
            message = "해당하는 닉네임을 찾지 못했습니다.";
            break;
        case SocialErrorNumber.ERROR_UNKNOWN:
            message = "알 수 없는 오류로 실패했습니다.";
            break;
        default:
            break;
    }
    if (message !== "") {
        alert(message);
    }
}

export function ChatSocketProcessor() {
    const currentAccountUUID = useCurrentAccountUUID();
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
                            await ChatStore.getFetchedMessageId(roomUUID);
                        if (messageUUID !== null) {
                            pairArray.push({
                                chatId: roomUUID,
                                messageId: messageUUID,
                            });
                        }
                    }
                }
                buf.writeArray(pairArray, writeChatRoomChatMessagePair);

                const directSet =
                    await ChatStore.getDirectSet(currentAccountUUID);
                const pairArrayDirect =
                    new Array<ChatRoomChatMessagePairEntry>();
                if (directSet !== null) {
                    for (const targetAccountId of directSet) {
                        const messageUUID =
                            await ChatStore.getDirectFetchedMessageId(
                                currentAccountUUID,
                                targetAccountId,
                            );
                        if (messageUUID !== null) {
                            pairArrayDirect.push({
                                chatId: targetAccountId,
                                messageId: messageUUID,
                            });
                        }
                    }
                }
                buf.writeArray(pairArrayDirect, writeChatRoomChatMessagePair);

                return buf.toArray();
            },
        }),
        [currentAccountUUID],
    );
    const getURL = useCallback(() => {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            return "";
        }
        return `wss://back.stri.dev/chat?token=${accessToken}`;
    }, []);
    useWebSocketConnector("chat", getURL, props);
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const [chatRoomList, setChatRoomList] = useAtom(ChatRoomListAtom);
    const mutateChatRoom = useChatRoomMutation();
    const setCurrentChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom);
    const [friendEntryList, setFriendEntryList] = useAtom(FriendEntryListAtom);
    const [enemyEntryList, setEnemyEntryList] = useAtom(EnemyEntryListAtom);
    const [friendRequestList, setFriendRequestList] = useAtom(
        FriendRequestListAtom,
    );
    useWebSocket("chat", undefined, async (opcode, buffer) => {
        switch (opcode) {
            case ChatClientOpcode.INITIALIZE: {
                const roomSet = await ChatStore.getRoomSet(currentAccountUUID);
                if (roomSet === null) {
                    throw new Error();
                }
                const directSet =
                    await ChatStore.getDirectSet(currentAccountUUID);
                if (directSet === null) {
                    throw new Error();
                }

                {
                    const chatRoomList = buffer.readArray(readChatRoom);
                    const promises = Array<Promise<boolean>>();
                    for (const room of chatRoomList) {
                        roomSet.delete(room.id);
                        promises.push(
                            ChatStore.addRoom(
                                currentAccountUUID,
                                room.id,
                                room.title,
                                toChatRoomModeFlags(room),
                            ),
                        );
                        promises.push(ChatStore.truncateMember(room.id));
                        for (const member of room.members) {
                            promises.push(ChatStore.putMember(room.id, member));
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
                            await ChatStore.setFetchedMessageId(
                                roomUUID,
                                latestMessage.id,
                            );
                        }
                    }

                    setChatRoomList(chatRoomList);
                }

                {
                    const directRoomList = buffer.readArray(readChatDirect);
                    const promises = Array<Promise<boolean>>();
                    for (const direct of directRoomList) {
                        directSet.delete(direct.targetAccountId);
                        promises.push(
                            ChatStore.addDirect(
                                currentAccountUUID,
                                direct.targetAccountId,
                                direct.lastMessageId,
                            ),
                        );
                    }
                    for (const targetAccountId of directSet) {
                        promises.push(
                            ChatStore.deleteDirect(
                                currentAccountUUID,
                                targetAccountId,
                            ),
                        );
                    }

                    await Promise.allSettled(promises);

                    const directMessageMapSize = buffer.readLength();
                    for (let i = 0; i < directMessageMapSize; i++) {
                        const targetAccountId = buffer.readUUID();
                        const messageList = buffer.readArray(readChatMessage);

                        const roomUUID = makeDirectChatKey(
                            currentAccountUUID,
                            targetAccountId,
                        );
                        await ChatStore.addMessageBulk(roomUUID, messageList);
                        const latestMessage =
                            await ChatStore.getLatestMessage(roomUUID);
                        if (latestMessage !== null) {
                            await ChatStore.setDirectFetchedMessageId(
                                currentAccountUUID,
                                targetAccountId,
                                latestMessage.id,
                            );
                        }
                    }

                    //FIXME: DirectRoom
                    // setDirectRoomList(directRoomList);
                }

                const socialPayload = readSocialPayload(buffer);
                setFriendEntryList(socialPayload.friendList);
                setFriendRequestList(socialPayload.friendRequestList);
                setEnemyEntryList(socialPayload.enemyList);
                break;
            }

            case ChatClientOpcode.ADD_FRIEND_RESULT: {
                const errno: SocialErrorNumber = buffer.read1();
                if (errno !== SocialErrorNumber.SUCCESS) {
                    handleFriendSocialError(errno);
                    break;
                }

                const friend = readFriend(buffer);
                setFriendEntryList([...friendEntryList, friend]);
                setFriendRequestList(
                    friendRequestList.filter(
                        (accountUUID) => accountUUID !== friend.friendAccountId,
                    ),
                );
                break;
            }

            case ChatClientOpcode.FRIEND_REQUEST: {
                const targetUUID = buffer.readUUID();
                setFriendRequestList([...friendRequestList, targetUUID]);
                //TODO: 알림?
                break;
            }

            case ChatClientOpcode.MODIFY_FRIEND_RESULT: {
                const errno: SocialErrorNumber = buffer.read1();
                if (errno !== SocialErrorNumber.SUCCESS) {
                    handleFriendSocialError(errno);
                    break;
                }

                const targetAccountId = buffer.readUUID();
                const friend = readFriend(buffer);
                setFriendEntryList([
                    ...friendEntryList.filter(
                        (entry) => entry.friendAccountId !== targetAccountId,
                    ),
                    friend,
                ]);
                break;
            }

            case ChatClientOpcode.UPDATE_FRIEND_ACTIVE_STATUS: {
                const targetUUID = buffer.readUUID();
                //FIXME: 해당 유저에 대한 activeStatus가 담긴 프로필 SWR revalidate
                break;
            }

            case ChatClientOpcode.DELETE_FRIEND_RESULT: {
                const errno: SocialErrorNumber = buffer.read1();
                if (errno !== SocialErrorNumber.SUCCESS) {
                    handleFriendSocialError(errno);
                    return;
                }

                const friendUUID = buffer.readUUID();
                const half = buffer.readBoolean();
                if (half) {
                    setFriendRequestList(
                        friendRequestList.filter(
                            (accountUUID) => accountUUID !== friendUUID,
                        ),
                    );
                } else {
                    setFriendEntryList(
                        friendEntryList.filter(
                            (friend) => friend.friendAccountId !== friendUUID,
                        ),
                    );
                }
                break;
            }

            case ChatClientOpcode.ADD_ENEMY_RESULT: {
                const errno: SocialErrorNumber = buffer.read1();
                if (errno !== SocialErrorNumber.SUCCESS) {
                    handleEnemySocialError(errno);
                    break;
                }

                const enemy = readEnemy(buffer);
                setEnemyEntryList([...enemyEntryList, enemy]);
                break;
            }
            case ChatClientOpcode.MODIFY_ENEMY_RESULT: {
                const errno: SocialErrorNumber = buffer.read1();
                if (errno !== SocialErrorNumber.SUCCESS) {
                    handleEnemySocialError(errno);
                    break;
                }

                const targetAccountId = buffer.readUUID();
                const enemy = readEnemy(buffer);
                setEnemyEntryList([
                    ...enemyEntryList.filter(
                        (entry) => entry.enemyAccountId !== targetAccountId,
                    ),
                    enemy,
                ]);
                break;
            }
            case ChatClientOpcode.DELETE_ENEMY_RESULT: {
                const errno: SocialErrorNumber = buffer.read1();
                if (errno !== SocialErrorNumber.SUCCESS) {
                    handleFriendSocialError(errno);
                    return;
                }

                const enemyUUID = buffer.readUUID();
                setEnemyEntryList(
                    enemyEntryList.filter(
                        (enemy) => enemy.enemyAccountId !== enemyUUID,
                    ),
                );
                break;
            }

            case ChatClientOpcode.INSERT_ROOM: {
                const chatRoom = readChatRoom(buffer);
                const messages = buffer.readArray(readChatMessage);
                await ChatStore.addRoom(
                    currentAccountUUID,
                    chatRoom.id,
                    chatRoom.title,
                    toChatRoomModeFlags(chatRoom),
                );
                await ChatStore.addMessageBulk(chatRoom.id, messages);
                setChatRoomList([...chatRoomList, chatRoom]);
                break;
            }
            case ChatClientOpcode.UPDATE_ROOM: {
                const chatRoom = readChatRoomView(buffer);
                await ChatStore.addRoom(
                    currentAccountUUID,
                    chatRoom.id,
                    chatRoom.title,
                    toChatRoomModeFlags(chatRoom),
                );
                break;
            }
            case ChatClientOpcode.REMOVE_ROOM: {
                const roomUUID = buffer.readUUID();
                if (currentChatRoomUUID === roomUUID) {
                    //NOTE: 내가 선택한 방에서 나간거면 리셋해주기
                    setCurrentChatRoomUUID("");
                }
                setChatRoomList(chatRoomList.filter((e) => e.id !== roomUUID));
                await ChatStore.deleteRoom(currentAccountUUID, roomUUID);
                break;
            }

            case ChatClientOpcode.CHAT_MESSAGE: {
                const message = readChatMessage(buffer);
                await ChatStore.addMessage(message.chatId, message);

                mutateChatRoom(message.chatId);
                break;
            }

            case ChatClientOpcode.SYNC_CURSOR: {
                //FIXME: 구현: 현재 채팅방 목록에서 lastReadMessage 바꿔주기. SWR도 mutate?
                const pair = readChatRoomChatMessagePair(buffer);
                void pair;

                mutateChatRoom(pair.chatId);
                break;
            }

            case ChatClientOpcode.KICK_NOTIFY: {
                //FIXME: 구현
                const chatId = buffer.readUUID();
                const ban = readChatBanSummary(buffer);
                break;
            }
            case ChatClientOpcode.MUTE_NOTIFY: {
                //FIXME: 구현
                const chatId = buffer.readUUID();
                const ban = readChatBanSummary(buffer);
                break;
            }

            case ChatClientOpcode.CHAT_DIRECT: {
                const targetAccountId = buffer.readUUID();
                const message = readChatMessage(buffer);

                const roomKey = makeDirectChatKey(
                    currentAccountUUID,
                    targetAccountId,
                );
                await ChatStore.addMessage(roomKey, message);

                mutateChatRoom(roomKey);
                break;
            }
        }
    });
    return <></>;
}
