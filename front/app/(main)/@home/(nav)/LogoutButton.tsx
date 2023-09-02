"use client";

import { AccessTokenAtom, RefreshTokenAtom } from "@/atom/AccountAtom";
import { SquareButton } from "@/components/Button/SquareButton";
import { useSetAtom } from "jotai";
import { mutate } from "swr";

export function LogoutButton() {
    const setAccessToken = useSetAtom(AccessTokenAtom);
    const setRefreshToken = useSetAtom(RefreshTokenAtom);

    return (
        <SquareButton
            onClick={() => {
                // Reset Token Atom
                setAccessToken(null);
                setRefreshToken(null);

                // Invalidate All SWR Cache
                void mutate(() => true, undefined, { revalidate: false });
            }}
        >
            Log out
        </SquareButton>
    );
}
