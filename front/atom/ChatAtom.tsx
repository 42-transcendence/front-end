"use client";

import type { ChatRoomEntry } from "@/library/payload/chat-payloads";
import { atom } from "jotai";

export const CreateNewRoomCheckedAtom = atom(false);

export const ChatRoomListAtom = atom(Array<ChatRoomEntry>());

export const CurrentChatRoomUUIDAtom = atom("");
