"use client";

import { ByteBuffer } from "@/library/akasha-lib";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { WebSocketContainer } from "@/library/react/websocket-hook";
import { useState, useEffect } from "react";

function DefaultLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex h-[100dvh] flex-shrink-0 flex-col">{children}</div>
    );
}

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
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        function checkAccessToken() {
            //TODO: 기존에 이미 인증된 상태(스토리지에 토큰이 있는 상태)라면 백으로 한번 보내서 검증시켜봐야 함.
            const accessToken = window.localStorage.getItem("access_token");
            setAccessToken(accessToken);
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
    }, []);

    if (accessToken === null) {
        return <DefaultLayout>{login}</DefaultLayout>;
    }

    //TODO: AccessToken이 왔는데 OTP가 필요한 JWT일 때
    if (false) {
        return <DefaultLayout>{otp}</DefaultLayout>;
    }

    //TODO: 정지당했을 경우
    // if (false) {
    //     return <DefaultLayout>{???}</DefaultLayout>
    // }

    //TODO: 탈퇴 유예기간인 경우
    // if (false) {
    //     return <DefaultLayout>{???}</DefaultLayout>
    // }

    //TODO: AccessToken으로 private을 조회했더니 nickName이 null일 때
    if (false) {
        return <DefaultLayout>{welcome}</DefaultLayout>;
    }

    return (
        <WebSocketContainer
            name="chat"
            url={`wss://back.stri.dev/chat?token=${accessToken}`}
            handshake={() =>
                ByteBuffer.createWithOpcode(
                    ChatServerOpcode.HANDSHAKE,
                ).toArray()
            }
        >
            <DefaultLayout>{home}</DefaultLayout>
        </WebSocketContainer>
    );
}
