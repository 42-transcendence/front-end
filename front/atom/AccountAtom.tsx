import type { AuthPayload } from "@/library/payload/auth-payload";
import { atom } from "jotai";

export const AuthAtom = atom<AuthPayload | undefined>(undefined);
export const AccessTokenAtom = atom<string | null>(null);
export const CurrentAccountUUIDAtom = atom<string>("");
