"use client";

import { useState, useEffect } from "react";

function setCookie(
    name: string,
    value: string,
    options: Record<string, any> & { expires?: Date | string | undefined } = {},
) {
    options = {
        path: "/",
        // 필요한 경우, 옵션 기본값을 설정할 수도 있습니다.
        ...options,
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie =
        encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (const optionKey in options) {
        updatedCookie += "; " + optionKey;
        const optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export default function MainLayout({
    login,
    home,
}: {
    login: React.ReactNode;
    home: React.ReactNode;
}) {
    const [loggedin, setLoggedin] = useState<boolean>(false);

    useEffect(() => {
        function checkAccessToken() {
            //TODO: 기존에 이미 인증된 상태(스토리지에 토큰이 있는 상태)라면 백으로 한번 보내서 검증시켜봐야 함.
            const accessToken = window.localStorage.getItem("access_token");
            setLoggedin(accessToken !== null);
            if (accessToken !== null) {
                setCookie("at", accessToken, { secure: true, "max-age": 3600 });
            }
        }

        checkAccessToken();

        const receiveMessage = (event: StorageEvent) => {
            if (event.key === "access_token") {
                checkAccessToken();
            }
        };

        window.addEventListener("storage", receiveMessage);

        return () => {
            window.removeEventListener("storage", receiveMessage);
        };
    }, [loggedin]);

    console.log(Object.keys(home ?? {}), Object.keys(login?? {}))

    return (
        <div className="flex h-[100dvh] flex-shrink-0 flex-col">
            {loggedin ? home : login}
        </div>
    );
}
