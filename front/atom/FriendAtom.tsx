import type {
    EnemyEntry,
    FriendEntry,
} from "@/library/payload/profile-payloads";
import { atom } from "jotai";

export const FriendEntryAtom = atom<FriendEntry[]>([]);
export const EnemyEntryAtom = atom<EnemyEntry[]>([]);
export const FriendRequestUUIDAtom = atom<string>("");
export const FriendRequestEntryAtom = atom<string[]>([]);
