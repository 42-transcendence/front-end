import type { EnemyEntry, FriendEntry } from "@common/chat-payloads";
import { atom } from "jotai";

export const FriendEntryAtom = atom<FriendEntry[]>([]);
export const EnemyEntryAtom = atom<EnemyEntry[]>([]);
export const FriendRequestEntryAtom = atom<string[]>([]);
