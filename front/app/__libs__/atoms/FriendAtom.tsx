import type { EnemyEntry, FriendEntry } from "@common/chat-payloads";
import { atom } from "jotai";

export const FriendEntryListAtom = atom<FriendEntry[]>([]);
export const EnemyEntryListAtom = atom<EnemyEntry[]>([]);
export const FriendRequestListAtom = atom<string[]>([]);
