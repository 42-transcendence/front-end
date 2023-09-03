"use client";

import type { TokenSet } from "@/library/payload/auth-payload";
import type { ReadonlyURLSearchParams } from "next/navigation";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const URL_BASE = "https://back.stri.dev";

export class HTTPError extends Error {
    constructor(readonly status: number) {
        super("HTTP Error");
    }
}

function localStorageSetItem(key: string, value: string | null) {
    const oldValue_access_token = window.localStorage.getItem(key);
    if (value !== null) {
        window.localStorage.setItem(key, value);
    } else {
        window.localStorage.removeItem(key);
    }
    window.dispatchEvent(
        new StorageEvent("storage", {
            storageArea: window.localStorage,
            key: key,
            oldValue: oldValue_access_token,
            newValue: value,
        }),
    );
}

async function fetchToken(url: URL, init?: RequestInit | undefined) {
    try {
        const response = await fetch(url, init);
        if (response.ok) {
            const token = (await response.json()) as TokenSet;
            localStorageSetItem(ACCESS_TOKEN_KEY, token.access_token);
            if (token.refresh_token !== undefined) {
                localStorageSetItem(REFRESH_TOKEN_KEY, token.refresh_token);
            }
            return true;
        }
    } catch {
        // do nothing
    }
    localStorageSetItem(ACCESS_TOKEN_KEY, null);
    return false;
}

export async function fetchBeginAuth(endpointKey: string, redirectURI: string) {
    const url = new URL("/auth/begin", URL_BASE);
    url.searchParams.set("endpoint_key", endpointKey);
    url.searchParams.set("redirect_uri", redirectURI);
    const response = await fetch(url);
    if (!response.ok) {
        throw new HTTPError(response.status);
    }
    const startURI = await response.text();
    return startURI;
}

export async function fetchEndAuth(searchParams: ReadonlyURLSearchParams) {
    const url = new URL("/auth/end", URL_BASE);
    for (const [key, val] of searchParams) {
        url.searchParams.append(key, val);
    }
    return await fetchToken(url);
}

export async function fetchPromotionAuth(otp: string) {
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken === null) {
        throw new Error("Access Token이 없습니다.");
    }

    const url = new URL("/auth/promotion", URL_BASE);
    url.searchParams.set("otp", otp);
    return await fetchToken(url, {
        headers: {
            ["Authorization"]: ["Bearer", accessToken].join(" "),
        },
    });
}

export async function fetchRefreshAuth() {
    const refreshTokenPop = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    localStorageSetItem(REFRESH_TOKEN_KEY, null);
    if (refreshTokenPop === null) {
        const refresh = window.localStorage.getItem("_refresh");
        if (refresh !== null) {
            if (Date.now() - Number(refresh) < 4000) {
                // refresh 시도 이후 4초 이내
                //FIXME: delay or event
                return true;
            }
        }

        localStorageSetItem(ACCESS_TOKEN_KEY, null);
        return false;
    }

    window.localStorage.setItem("_refresh", Date.now().toString());
    try {
        const url = new URL("/auth/refresh", URL_BASE);
        url.searchParams.set("refresh_token", refreshTokenPop);
        return await fetchToken(url);
    } finally {
        window.localStorage.removeItem("_refresh");
    }
}

async function fetchBase<T>(
    url: URL,
    init?: RequestInit | undefined,
): Promise<T> {
    let retry = 3;
    do {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            throw new Error("Access Token이 없습니다.");
        }

        const response = await fetch(url, {
            ...init,
            ...{
                headers: {
                    ["Authorization"]: ["Bearer", accessToken].join(" "),
                },
            },
        });
        if (!response.ok) {
            if (response.status === 401) {
                if (!(await fetchRefreshAuth())) {
                    throw new Error("Token Refresh를 하지 못했습니다.");
                }
                continue;
            }

            throw new HTTPError(response.status);
        }

        const json = (await response.json()) as T;
        return json;
    } while (retry-- > 0);

    throw new Error("최대 시도 횟수를 초과했습니다.");
}

export async function fetcher<T>(key: string): Promise<T> {
    const url = new URL(key, URL_BASE);
    return fetchBase(url);
}

export async function fetcherPOST<T>(key: string, body: object): Promise<T> {
    const url = new URL(key, URL_BASE);
    return fetchBase(url, {
        method: "POST",
        headers: {
            ["Content-Type"]: "application/json",
        },
        body: JSON.stringify(body),
    });
}
