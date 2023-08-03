"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AuthCallback() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<number>();
    const [token, setToken] = useState<string>();
    useEffect(() => {
        const url = new URL("https://back.stri.dev/auth/callback");
        for (const [key, val] of searchParams) {
            url.searchParams.append(key, val);
        }
        fetch(url).then((response) => {
            setStatus(response.status);
            if (response.ok) {
                response.text().then((text) => {
                    setToken(text);
                });
            }
        });
    }, [searchParams]);

    return (
        <>
            <p>Authorization Code: {searchParams.get("code")}</p>
            <p>State: {searchParams.get("state")}</p>
            <p>
                {status === undefined ? "로오딩..." : status === 200
                    ? "성공했습니다!"
                    : `실패했습니다... ${status}`}
            </p>
            <br />
            <p>{token}</p>
        </>
    );
}
