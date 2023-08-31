"use client";

//TODO: 훗날 여유가 된다면 전부 커스텀 훅으로 만들것 제발
export { default as useSWR } from "swr";

export async function fetcher<T>(url: string): Promise<T> {
    const accessToken: string | null =
        window.localStorage.getItem("access_token");
    if (accessToken === null) {
        throw new Error("너 액세스 토큰 없음 ㅋㅋ");
    }

    const response = await fetch(`https://back.stri.dev${url}`, {
        headers: {
            ["Authorization"]: ["Bearer", accessToken].join(" "),
        },
    });
    return response.json() as T;
}

export async function fetcher_POST<T>(url: string, body: object): Promise<T> {
    const accessToken: string | null =
        window.localStorage.getItem("access_token");
    if (accessToken === null) {
        throw new Error("너 액세스 토큰 없음 ㅋㅋ");
    }

    const response = await fetch(`https://back.stri.dev${url}`, {
        method: "POST",
        headers: {
            ["Content-Type"]: "application/json",
            ["Authorization"]: ["Bearer", accessToken].join(" "),
        },
        body: JSON.stringify(body),
    });
    return response.json() as T;
}
