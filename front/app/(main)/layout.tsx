"use client";

import { useState, useEffect } from "react";

export default function MainLayout({
    login,
    otp,
    welcome,
    home,
}: {
    login: React.ReactNode;
    otp: React.ReactNode;
    welcome: React.ReactNode;
    home: React.ReactNode;
}) {
    const [loggedin, setLoggedin] = useState<boolean>(false);

    useEffect(() => {
        function checkAccessToken() {
            //TODO: 기존에 이미 인증된 상태(스토리지에 토큰이 있는 상태)라면 백으로 한번 보내서 검증시켜봐야 함.
            const accessToken = window.localStorage.getItem("access_token");
            setLoggedin(accessToken !== null);
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

    return (
        <div className="flex h-[100dvh] flex-shrink-0 flex-col">
            {loggedin ? home : login}
        </div>
    );
}
