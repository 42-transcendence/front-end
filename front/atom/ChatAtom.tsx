"use client";

import type { MessageSchema } from "@/library/idb/chat-store";
import { ChatStore } from "@/library/idb/chat-store";
import type { ChatRoomEntry } from "@/library/payload/chat-payloads";
import { atom } from "jotai";

export const CreateNewRoomCheckedAtom = atom(false);

export const ChatRoomListAtom = atom(Array<ChatRoomEntry>());

export const CurrentChatRoomAtom = atom(
    null,
    async (_, set, roomUUID: string) => {
        set(_backing_CurrentChatRoomUUIDAtom, roomUUID);
        set(
            _backing_CurrentChatRoomTitleAtom,
            roomUUID !== "" ? await ChatStore.getTitle(roomUUID) : "",
        );
        set(
            CurrentChatMessagesAtom,
            roomUUID !== "" ? await ChatStore.getAllMessages(roomUUID) : [],
        );
    },
);
export const CurrentChatRoomUUIDAtom = atom((get) =>
    get(_backing_CurrentChatRoomUUIDAtom),
);
export const CurrentChatRoomTitleAtom = atom((get) =>
    get(_backing_CurrentChatRoomTitleAtom),
);

const _backing_CurrentChatRoomUUIDAtom = atom("");
const _backing_CurrentChatRoomTitleAtom = atom("");

export const CurrentChatMessagesAtom = atom(Array<MessageSchema>());
