"use client";

import { useState, useEffect } from "react";

export default function MainLayout({
    login,
    main,
}: {
    login: React.ReactNode;
    main: React.ReactNode;
}) {
    const [loggedin, setLoggedin] = useState<boolean>(false);

    useEffect(() => {
        //TODO: 기존에 이미 인증된 상태(스토리지에 토큰이 있는 상태)라면 백으로 한번 보내서 검증시켜봐야 함.
        setLoggedin(window.localStorage.getItem("access_token") !== null);
        // console.log("token:", window.localStorage.getItem("access_token"));

        const receiveMessage = (event: StorageEvent) => {
            if (event.key === "access_token") {
                //TODO: 토큰의 유효성 검증? 위의 로직과 겹칠 가능성이 있으므로 함수로 분리하는게 나을 수도
                setLoggedin(true);
            }
        };

        window.addEventListener("storage", receiveMessage);

        return () => {
            window.removeEventListener("storage", receiveMessage);
        };
    }, [loggedin]);

    return <>{loggedin ? main : login}</>;
}
