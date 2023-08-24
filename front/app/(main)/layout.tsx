"use client";

import { ByteBuffer } from "@/library/akasha-lib";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { WebSocketContainer } from "@/library/react/websocket-hook";
import { useState, useEffect } from "react";
import * as jose from "jose";
import { AuthLevel, isAuthPayload } from "@/library/payload/auth-payload";

function DefaultLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex h-[100dvh] flex-shrink-0 flex-col">{children}</div>
    );
}

const ACCESS_TOKEN_KEY = "access_token";

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
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken !== null) {
            setAccessToken(accessToken);
        }
    }, []);

    useEffect(() => {
        const receiveMessage = (event: StorageEvent) => {
            if (event.storageArea !== window.localStorage) {
                return;
            }

            if (event.key === ACCESS_TOKEN_KEY) {
                setAccessToken(event.newValue);
            }
        };

        window.addEventListener("storage", receiveMessage);

        return () => {
            window.removeEventListener("storage", receiveMessage);
        };
    }, []);

    useEffect(() => {
        if (accessToken !== null) {
            // 이거 가지고 검증할 수 있지 않을까?
            try {
                const payload = jose.decodeJwt(accessToken);
                const exp = payload.exp;
                if (exp === undefined || exp < Date.now() / 1000) {
                    // 당신 토큰은 만료되었다 수고해라
                    // 아니지 리프레시는 한번 시도해봐야지!
                    console.log(Date.now(), Date.now() / 1000);
                } else {
                    // 타이머를 돌립시다. exp가 끝나는 시점까지
                    // 근데 서버를 위한 톨러런스가 어느정도 있는게 좋지 않을까? 시간 차이가 좀 날 수도 있으니까
                    // 근데 시간이 정 안맞아서 계속 리프레시를 날리는 클라이언트는 어떻게 해야할까? 시계 맞추라고 공지 띄워줘?

                    const remainingSecs = exp - Date.now() / 1000;
                    const tolerance = 30000;
                    setTimeout(() => {}, remainingSecs * 1000 - tolerance);
                    //TODO: 이 타임아웃을 없애주는 애를 리턴해야함.
                }
                if (isAuthPayload(payload)) {
                    if (payload.auth_level === AuthLevel.TEMPORARY) {
                        // OTP로 가시오
                    } else if (payload.auth_level === AuthLevel.BLOCKED) {
                        // 당신은 정지당했습니다.
                    } else if (payload.auth_level === AuthLevel.COMPLETED) {
                        // 넌 최고야!
                    }
                }
                console.log(payload);
            } catch {
                window.localStorage.removeItem(ACCESS_TOKEN_KEY);
                setAccessToken(null);
            }
        }
    }, [accessToken]);

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
        <DefaultLayout>
            <WebSocketContainer
                name="chat"
                url={`wss://back.stri.dev/chat?token=${accessToken}`}
                handshake={() =>
                    ByteBuffer.createWithOpcode(
                        ChatServerOpcode.HANDSHAKE,
                    ).toArray()
                }
            />
            {home}
        </DefaultLayout>
    );
}
