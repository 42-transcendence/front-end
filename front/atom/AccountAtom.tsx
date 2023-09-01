import type { AuthPayload } from "@/library/payload/auth-payload";
import { atom } from "jotai";

export const AccessTokenAtom = atom<string | null>(null);
export const CurrentAccountUUIDAtom = atom<string>("");

//TODO: AccessToken에 의해서 간접적으로 처리해줘야함.
export const AuthAtom = atom<AuthPayload | undefined>(undefined);

export const TargetedAccountUUIDAtom = atom<string>("");
export const SelectedAccountUUIDsAtom = atom<string[]>([]);
