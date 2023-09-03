"use client";

import { SquareButton } from "@/components/Button/SquareButton";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/hooks/fetcher";
import { localStorageSetItem } from "@/hooks/storage";
import { mutate } from "swr";

export function LogoutButton() {
    return (
        <SquareButton
            onClick={() => {
                // Reset Token
                localStorageSetItem(ACCESS_TOKEN_KEY, null);
                localStorageSetItem(REFRESH_TOKEN_KEY, null);

                // Invalidate All SWR Cache
                void mutate(() => true, undefined, { revalidate: false });
            }}
        >
            Log out
        </SquareButton>
    );
}
