import {
    isAuthPayload,
    type AuthPayload,
    AuthLevel,
} from "@/library/payload/auth-payload";
import { decodeJwt } from "jose";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const AccessTokenAtom = atomWithStorage<string | null>(
    "access_token",
    null,
);
export const RefreshTokenAtom = atomWithStorage<string | null>(
    "refresh_token",
    null,
);

export const AuthAtom = atom<AuthPayload | undefined>((get) => {
    const accessToken = get(AccessTokenAtom);
    if (accessToken !== null) {
        const payload = decodeJwt(accessToken);
        if (!isAuthPayload(payload)) {
            throw new Error("Access Token이 규격을 만족하지 않습니다.");
        }
        return payload;
    }
    return undefined;
});
export const CurrentAccountUUIDAtom = atom<string>((get) => {
    const auth = get(AuthAtom);
    return auth !== undefined && auth.auth_level === AuthLevel.COMPLETED ? auth.user_id : "";
});

export const TargetedAccountUUIDAtom = atom<string>("");
export const SelectedAccountUUIDsAtom = atom<string[]>([]);
