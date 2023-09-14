"use client";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@hooks/fetcher";
import { setLocalStorageItem } from "@hooks/storage";
import { mutate } from "swr";

// TODO: 파일 옮기기
export function logoutAction() {
    // Reset Token
    setLocalStorageItem(ACCESS_TOKEN_KEY, null);
    setLocalStorageItem(REFRESH_TOKEN_KEY, null);

    // Invalidate All SWR Cache
    // TODO: mutate throwOnError?
    void mutate(() => true, undefined, { revalidate: false });
}
