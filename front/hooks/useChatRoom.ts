import { ChatStore } from "@/library/idb/chat-store";
import { useSWR } from "./useSWR";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { ChatRoomListAtom } from "@/atom/ChatAtom";
import { GlobalStore } from "@/atom/GlobalStore";
import { useAtomCallback } from "jotai/utils";

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
            ChatStore.getLatestMessage(roomUUID),
        [],
    );
    const { data } = useSWR(["ChatStore", roomUUID, "LatestMessage"], callback);
    return data;
}

export function useChatRoomUnreadCount(roomUUID: string) {
    const callback = useAtomCallback(
        useCallback(
            async (get, _set, [, roomUUID]: [string, string, string]) => {
                const roomList = get(ChatRoomListAtom);
                const lastReadMessageUUID =
                    roomList.find((e) => e.id === roomUUID)?.lastMessageId ??
                    "";
                return lastReadMessageUUID !== ""
                    ? await ChatStore.countAfterMessage(
                          roomUUID,
                          lastReadMessageUUID,
                      )
                    : 0;
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
