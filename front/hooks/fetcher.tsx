"use client";

import { AccessTokenAtom, RefreshTokenAtom } from "@/atom/AccountAtom";
import type { TokenSet } from "@/library/payload/auth-payload";
import type { Getter as AtomGetter, Setter as AtomSetter } from "jotai";
import { RESET } from "jotai/utils";
import type { ReadonlyURLSearchParams } from "next/navigation";

const urlBase = "https://back.stri.dev";

export class HTTPError extends Error {
    constructor(readonly status: number) {
        super("HTTP Error");
    }
}

async function fetchToken(
    setAtom: AtomSetter,
    url: URL,
    init?: RequestInit | undefined,
) {
    try {
        const response = await fetch(url, init);
        let token: TokenSet | undefined;
        if (response.ok) {
            token = (await response.json()) as TokenSet;
        }
        setAtom(AccessTokenAtom, token?.access_token ?? RESET);
        setAtom(RefreshTokenAtom, token?.refresh_token ?? RESET);
        return token !== undefined;
    } catch {
        return false;
    }
}

export async function fetchBeginAuth(endpointKey: string, redirectURI: string) {
    const url = new URL("/auth/begin", urlBase);
    url.searchParams.set("endpoint_key", endpointKey);
    url.searchParams.set("redirect_uri", redirectURI);
    const response = await fetch(url);
    if (!response.ok) {
        throw new HTTPError(response.status);
    }
    const startURI = await response.text();
    return startURI;
}

export async function fetchEndAuth(
    setAtom: AtomSetter,
    searchParams: ReadonlyURLSearchParams,
) {
    const url = new URL("/auth/end", urlBase);
    for (const [key, val] of searchParams) {
        url.searchParams.append(key, val);
    }
    return await fetchToken(setAtom, url);
}

export async function fetchPromotionAuth(
    getAtom: AtomGetter,
    setAtom: AtomSetter,
    otp: string,
) {
    const accessToken = getAtom(AccessTokenAtom);
    if (accessToken === null) {
        throw new Error("Access Token이 없습니다.");
    }

    const url = new URL("/auth/promotion", urlBase);
    url.searchParams.set("otp", otp);
    return await fetchToken(setAtom, url, {
        headers: {
            ["Authorization"]: ["Bearer", accessToken].join(" "),
        },
    });
}

export async function fetchRefreshAuth(
    getAtom: AtomGetter,
    setAtom: AtomSetter,
) {
    const refreshToken = getAtom(RefreshTokenAtom);
    if (refreshToken === null) {
        return false;
    }

    const url = new URL("/auth/refresh", urlBase);
    url.searchParams.set("refresh_token", refreshToken);
    return await fetchToken(setAtom, url);
}

async function fetchBase<T>(
    getAtom: AtomGetter,
    setAtom: AtomSetter,
    url: URL,
    init?: RequestInit | undefined,
): Promise<T> {
    let retry = 1;
    do {
        const accessToken = getAtom(AccessTokenAtom);
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
                if (!(await fetchRefreshAuth(getAtom, setAtom))) {
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

export async function fetcher<T>(
    getAtom: AtomGetter,
    setAtom: AtomSetter,
    key: string,
): Promise<T> {
    const url = new URL(key, urlBase);
    return fetchBase(getAtom, setAtom, url);
}

export async function fetcherPOST<T>(
    getAtom: AtomGetter,
    setAtom: AtomSetter,
    key: string,
    body: object,
): Promise<T> {
    const url = new URL(key, urlBase);
    return fetchBase(getAtom, setAtom, url, {
        method: "POST",
        headers: {
            ["Content-Type"]: "application/json",
        },
        body: JSON.stringify(body),
    });
}
