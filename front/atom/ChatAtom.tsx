"use client";

import { ChatStore, MessageSchema } from "@/library/idb/chat-store";
import type { ChatRoomEntry } from "@/library/payload/chat-payloads";
import { atom } from "jotai";

export const CreateNewRoomCheckedAtom = atom(false);

export const ChatRoomListAtom = atom(Array<ChatRoomEntry>());

export const CurrentChatRoomUUIDAtom = atom<string, [string], void>(
    (get) => get(_backing_CurrentChatRoomUUIDAtom),
    async (_, set, arg) => {
        set(_backing_CurrentChatRoomUUIDAtom, arg);
        set(CurrentChatRoomTitleAtom, await ChatStore.getTitle(arg));
        set(CurrentChatMessagesAtom, await ChatStore.getAllMessages(arg));
    },
);
const _backing_CurrentChatRoomUUIDAtom = atom("");
export const CurrentChatRoomTitleAtom = atom("");
export const CurrentChatMessagesAtom = atom(Array<MessageSchema>());
