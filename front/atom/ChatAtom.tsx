"use client";

import { MessageSchema } from "@/library/idb/chat-store";
import type { ChatRoomEntry } from "@/library/payload/chat-payloads";
import { atom } from "jotai";

export const ChatRoomListAtom = atom(Array<ChatRoomEntry>());

export const CurrentChatRoomUUIDAtom = atom("");
export const CurrentChatRoomTitleAtom = atom("");
export const CurrentChatMessagesAtom = atom(Array<MessageSchema>());
