import type { EnemyEntry, FriendEntry } from "@/library/payload/chat-payloads";
import { atom } from "jotai";

export const FriendEntryAtom = atom<FriendEntry[]>([]);
export const EnemyEntryAtom = atom<EnemyEntry[]>([]);
export const FriendRequestEntryAtom = atom<string[]>([]);
