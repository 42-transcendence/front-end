"use client";

import type { TokenSet } from "@common/auth-payloads";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { setLocalStorageItem } from "./storage";
import {
    ACCESS_TOKEN_KEY,
    HOST,
    HTTPResponseCode,
    REFRESH_TOKEN_KEY,
} from "@utils/constants";

const URL_BASE = `https://${HOST}`;

const LAST_REFRESH_TIMESTAMP = "_refresh";

export class HTTPError extends Error {
    constructor(readonly status: number) {
        super("HTTP Error");
    }
}

async function fetchToken(url: URL, init?: RequestInit | undefined) {
    try {
        const response = await fetch(url, init);
        if (response.ok) {
            const token = (await response.json()) as TokenSet;
            setLocalStorageItem(ACCESS_TOKEN_KEY, token.access_token);
            if (token.refresh_token !== undefined) {
                setLocalStorageItem(REFRESH_TOKEN_KEY, token.refresh_token);
            }
            return true;
        }
    } catch {
        // do nothing
    }
    setLocalStorageItem(ACCESS_TOKEN_KEY, null);
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
    setLocalStorageItem(REFRESH_TOKEN_KEY, null);
    if (refreshTokenPop === null) {
        const refresh = window.localStorage.getItem(LAST_REFRESH_TIMESTAMP);
        if (refresh !== null) {
            if (Date.now() - Number(refresh) < 4000) {
                // NOTE: refresh 시도 이후 4초 이내
                return true;
            }
        }

        setLocalStorageItem(ACCESS_TOKEN_KEY, null);
        return false;
    }

    window.localStorage.setItem(LAST_REFRESH_TIMESTAMP, Date.now().toString());
    try {
        const url = new URL("/auth/refresh", URL_BASE);
        url.searchParams.set(REFRESH_TOKEN_KEY, refreshTokenPop);
        return await fetchToken(url);
    } finally {
        window.localStorage.removeItem(LAST_REFRESH_TIMESTAMP);
    }
}

export async function fetchBase<T>(
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
            headers: {
                ...init?.headers,
                ["Authorization"]: ["Bearer", accessToken].join(" "),
            },
        });
        if (!response.ok) {
            if (response.status === HTTPResponseCode.UNAUTHORIZED) {
                if (!(await fetchRefreshAuth())) {
                    throw new Error("Token Refresh를 하지 못했습니다.");
                }
                continue;
            }

            throw new HTTPError(response.status);
        }

        const contentType = response.headers.get("content-type");
        if (contentType === null || !contentType.includes("application/json")) {
            const text = (await response.text()) as T;
            return text;
        } else {
            const json = (await response.json()) as T;
            return json;
        }
    } while (retry-- > 0);

    throw new Error("최대 시도 횟수를 초과했습니다.");
}

export async function fetcher<T>(key: string): Promise<T> {
    const url = new URL(key, URL_BASE);
    return fetchBase(url);
}

export async function fetcherPOST<T>(
    key: string,
    body?: object | undefined,
): Promise<T> {
    const url = new URL(key, URL_BASE);
    return fetchBase(url, {
        method: "POST",
        ...(body === undefined || body instanceof FormData
            ? { body }
            : {
                  headers: {
                      ["Content-Type"]: "application/json",
                  },
                  body: JSON.stringify(body),
              }),
    });
}

export async function fetcherPUT<T>(
    key: string,
    body?: object | undefined,
): Promise<T> {
    const url = new URL(key, URL_BASE);
    return fetchBase(url, {
        method: "PUT",
        ...(body === undefined || body instanceof FormData
            ? { body }
            : {
                  headers: {
                      ["Content-Type"]: "application/json",
                  },
                  body: JSON.stringify(body),
              }),
    });
}

export async function fetchMethod(key: string, method: string) {
    const url = new URL(key, URL_BASE);
    return await fetchBase(url, { method });
}
