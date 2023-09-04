"use client";

import { SquareButton } from "@/components/Button/SquareButton";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/hooks/fetcher";
import { setLocalStorageItem } from "@/hooks/storage";
import { mutate } from "swr";

export function LogoutButton() {
    return (
        <SquareButton
            onClick={() => {
                // Reset Token
                setLocalStorageItem(ACCESS_TOKEN_KEY, null);
                setLocalStorageItem(REFRESH_TOKEN_KEY, null);

                // Invalidate All SWR Cache
                void mutate(() => true, undefined, { revalidate: false });
            }}
        >
            Log out
        </SquareButton>
    );
}
