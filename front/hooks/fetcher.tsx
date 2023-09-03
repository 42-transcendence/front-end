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

async function fetchToken(url: URL, init?: RequestInit | undefined) {
    try {
        const oldValue_access_token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        const oldValue_refresh_token = window.localStorage.getItem(REFRESH_TOKEN_KEY);

        const response = await fetch(url, init);
        if (response.ok) {
            const token = (await response.json()) as TokenSet;
            window.localStorage.setItem(ACCESS_TOKEN_KEY, token.access_token);
            window.dispatchEvent(
                new StorageEvent("storage", {
                    storageArea: window.localStorage,
                    key: ACCESS_TOKEN_KEY,
                    oldValue: oldValue_access_token,
                    newValue: token.access_token,
                }),
            );
            if (token.refresh_token !== undefined) {
                window.localStorage.setItem(
                    REFRESH_TOKEN_KEY,
                    token.refresh_token,
                );
                window.dispatchEvent(
                    new StorageEvent("storage", {
                        storageArea: window.localStorage,
                        key: REFRESH_TOKEN_KEY,
                        oldValue: oldValue_refresh_token,
                        newValue: token.refresh_token,
                    }),
                );
            }
            return true;
        }

        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.dispatchEvent(
            new StorageEvent("storage", {
                storageArea: window.localStorage,
                key: ACCESS_TOKEN_KEY,
                oldValue: oldValue_access_token,
                newValue: null,
            }),
        );
        window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.dispatchEvent(
            new StorageEvent("storage", {
                storageArea: window.localStorage,
                key: REFRESH_TOKEN_KEY,
                oldValue: oldValue_refresh_token,
                newValue: null,
            }),
        );
        return false;
    } catch {
        return false;
    }
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
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken === null) {
        return false;
    }

    const url = new URL("/auth/refresh", URL_BASE);
    url.searchParams.set("refresh_token", refreshToken);
    return await fetchToken(url);
}

async function fetchBase<T>(
    url: URL,
    init?: RequestInit | undefined,
): Promise<T> {
    let retry = 1;
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
