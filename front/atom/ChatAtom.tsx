"use client";

import { ChatStore } from "@/library/idb/chat-store";
import type { ChatRoomEntry } from "@/library/payload/chat-payloads";
import { atom } from "jotai";

export const CurrentChatRoomUUIDAtom = atom("");
export const CurrentChatRoomTitleAtom = atom(async (get) => {
    try {
        return await ChatStore.getTitle(get(CurrentChatRoomUUIDAtom));
    } catch {
        return "";
    }
});
export const ChatRoomListAtom = atom(new Array<ChatRoomEntry>());
