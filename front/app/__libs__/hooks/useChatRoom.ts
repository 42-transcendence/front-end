import {
    ChatStore,
    extractTargetFromDirectChatKey,
    isDirectChatKey,
    makeDirectChatKey,
} from "@akasha-utils/idb/chat-store";
import { useSWR } from "./useSWR";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import {
    ChatRightSideBarCurrrentPage,
    ChatRoomListAtom,
    DirectRoomListAtom,
} from "@atoms/ChatAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { useAtomCallback } from "jotai/utils";
import { MessageTypeNumber } from "@common/generated/types";
import { useAtom, useSetAtom } from "jotai";
import { ChatRoomModeFlags } from "@common/chat-payloads";
import { useCurrentAccountUUID } from "./useCurrent";
import { NULL_UUID } from "@akasha-lib";

export function useChatRoomTitle(roomUUID: string) {
    const callback = useCallback(
        async ([, roomUUID]: [string, string, string]) =>
            roomUUID === ""
                ? ""
                : isDirectChatKey(roomUUID)
                ? "1:1 채팅방"
                : ChatStore.getTitle(roomUUID),
        [],
    );
    const { data } = useSWR(["ChatStore", roomUUID, "Title"], callback);
    return data;
}

export function useChatRoomModeFlags(roomUUID: string) {
    const callback = useCallback(
        async ([, roomUUID]: [string, string, string]) =>
            roomUUID === ""
                ? 0
                : isDirectChatKey(roomUUID)
                ? ChatRoomModeFlags.PRIVATE | ChatRoomModeFlags.SECRET
                : ChatStore.getModeFlags(roomUUID),
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
    const currentAccountUUID = useCurrentAccountUUID();
    const callback = useAtomCallback(
        useCallback(
            async (get, _set) => {
                const roomList = get(ChatRoomListAtom);
                const promises = roomList.map((room) => {
                    const lastMessageId = room.lastMessageId;
                    return ChatStore.countAfterMessage(room.id, lastMessageId);
                });

                const unreadCounts = await Promise.all(promises);
                const totalUnreadCount = unreadCounts.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                );

                const directList = get(DirectRoomListAtom);
                const promisesDirect = directList.map((room) => {
                    const lastMessageId = room.lastMessageId;
                    return ChatStore.countAfterMessage(
                        makeDirectChatKey(
                            currentAccountUUID,
                            room.targetAccountId,
                        ),
                        lastMessageId,
                    );
                });

                const unreadCountsDirect = await Promise.all(promisesDirect);
                const totalUnreadCountDirect = unreadCountsDirect.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                );

                return totalUnreadCount + totalUnreadCountDirect;
            },
            [currentAccountUUID],
        ),
        { store: GlobalStore },
    );
    const { data } = useSWR(["ChatStore", NULL_UUID, "UnreadCount"], callback);
    return data;
}

export function useChatRoomUnreadCount(roomUUID: string) {
    const callback = useAtomCallback(
        useCallback(
            async (get, _set, [, roomUUID]: [string, string, string]) => {
                if (roomUUID === "") {
                    return 0;
                }
                let lastReadMessageUUID: string | null;
                if (isDirectChatKey(roomUUID)) {
                    const directList = get(DirectRoomListAtom);
                    lastReadMessageUUID =
                        directList.find(
                            (e) =>
                                e.targetAccountId ===
                                extractTargetFromDirectChatKey(roomUUID),
                        )?.lastMessageId ?? null;
                } else {
                    const roomList = get(ChatRoomListAtom);
                    lastReadMessageUUID =
                        roomList.find((e) => e.id === roomUUID)
                            ?.lastMessageId ?? null;
                }
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
    const { data, isLoading } = useSWR(
        ["ChatStore", roomUUID, "Messages"],
        callback,
    );
    return [data, !isLoading] as const;
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
    const mutateOne = useCallback(
        (roomUUID: string) =>
            void mutate(
                (key) =>
                    Array.isArray(key) &&
                    key[0] === "ChatStore" &&
                    key[1] === roomUUID,
            ),
        [mutate],
    );
    const mutateGlobal = useCallback(
        () =>
            void mutate(
                (key) =>
                    Array.isArray(key) &&
                    key[0] === "ChatStore" &&
                    key[1] === NULL_UUID,
            ),
        [mutate],
    );

    return useCallback(
        (roomUUID: string) => {
            mutateOne(roomUUID);
            mutateGlobal();
        },
        [mutateOne, mutateGlobal],
    );
}

export function useChatRoomListAtom() {
    return useAtom(ChatRoomListAtom, { store: GlobalStore });
}

export function useDirectRoomListAtom() {
    return useAtom(DirectRoomListAtom, { store: GlobalStore });
}

export function useChatRightSideBarCurrrentPageAtom() {
    return useAtom(ChatRightSideBarCurrrentPage, { store: GlobalStore });
}

export function useSetChatRightSideBarCurrrentPageAtom() {
    return useSetAtom(ChatRightSideBarCurrrentPage, { store: GlobalStore });
}
