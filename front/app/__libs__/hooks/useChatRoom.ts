import { ChatStore } from "@akasha-utils/idb/chat-store";
import { useSWR } from "./useSWR";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { ChatRoomListAtom } from "@atoms/ChatAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { useAtomCallback } from "jotai/utils";
import { NULL_UUID } from "@akasha-lib";
import { MessageTypeNumber } from "@common/generated/types";

export function useChatRoomTitle(roomUUID: string) {
    const callback = useCallback(
        async ([, roomUUID]: [string, string, string]) =>
            ChatStore.getTitle(roomUUID),
        [],
    );
    const { data } = useSWR(["ChatStore", roomUUID, "Title"], callback);
    return data;
}

export function useChatRoomModeFlags(roomUUID: string) {
    const callback = useCallback(
        async ([, roomUUID]: [string, string, string]) =>
            ChatStore.getModeFlags(roomUUID),
        [],
    );
    const { data } = useSWR(["ChatStore", roomUUID, "ModeFlags"], callback);
    return data;
}

export function useChatRoomLatestMessage(roomUUID: string) {
    const callback = useCallback(
        async ([, roomUUID]: [string, string, string]) =>
            ChatStore.getLatestMessage(roomUUID, MessageTypeNumber.REGULAR),
        [],
    );
    const { data } = useSWR(["ChatStore", roomUUID, "LatestMessage"], callback);
    return data;
}

export function useChatRoomTotalUnreadCount() {
    const callback = useAtomCallback(
        useCallback(async (get, _set) => {
            const roomList = get(ChatRoomListAtom);
            const promises = roomList.map((room) => {
                const lastMessageId = room.lastMessageId ?? NULL_UUID;
                return ChatStore.countAfterMessage(room.id, lastMessageId);
            });

            const unreadCounts = await Promise.all(promises);
            const totalUnreadCount = unreadCounts.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
            );
            return totalUnreadCount;
        }, []),
        { store: GlobalStore },
    );
    const { data } = useSWR(["ChatStore", "TotalUnreadCount"], callback);
    return data;
}

export function useChatRoomUnreadCount(roomUUID: string) {
    const callback = useAtomCallback(
        useCallback(
            async (get, _set, [, roomUUID]: [string, string, string]) => {
                const roomList = get(ChatRoomListAtom);
                const lastReadMessageUUID =
                    roomList.find((e) => e.id === roomUUID)?.lastMessageId ??
                    NULL_UUID;
                return await ChatStore.countAfterMessage(
                    roomUUID,
                    lastReadMessageUUID,
                );
            },
            [],
        ),
        { store: GlobalStore },
    );
    const { data } = useSWR(["ChatStore", roomUUID, "UnreadCount"], callback);
    return data;
}

export function useChatRoomMembers(roomUUID: string) {
    const callback = useCallback(
        async ([, roomUUID]: [string, string, string]) =>
            ChatStore.getMemberDictionary(roomUUID),
        [],
    );
    const { data } = useSWR(["ChatStore", roomUUID, "Members"], callback);
    return data;
}

export function useChatRoomMessages(roomUUID: string) {
    const callback = useCallback(
        async ([, roomUUID]: [string, string, string]) =>
            ChatStore.getAllMessages(roomUUID),
        [],
    );
    const { data } = useSWR(["ChatStore", roomUUID, "Messages"], callback);
    return data;
}

export function useChatMember(roomUUID: string, memberUUID: string) {
    const callback = useCallback(
        async ([, roomUUID, , memberUUID]: [string, string, string, string]) =>
            ChatStore.getMember(roomUUID, memberUUID),
        [],
    );
    const { data } = useSWR(
        ["ChatStore", roomUUID, "Member", memberUUID],
        callback,
    );
    return data;
}

export function useChatRoomMutation() {
    const { mutate } = useSWRConfig();

    return (roomUUID: string) =>
        void mutate(
            (key) =>
                Array.isArray(key) &&
                key[0] === "ChatStore" &&
                key[1] === roomUUID,
        );
}
