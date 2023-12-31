"use client";

import { AuthLevel } from "@common/auth-payloads";
import { AuthAtom } from "@atoms/AccountAtom";
import { useAtomValue } from "jotai";
import { ChatSocketProcessor } from "./ChatSocketProcessor";
import { usePrivateProfile } from "@hooks/useProfile";
import { useEffect, useState } from "react";
import { DoubleSharp } from "@components/ImageLibrary";
import { useToken } from "@hooks/useToken";
import { logout } from "@utils/action";

function DefaultLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex h-[100dvh] flex-shrink-0 flex-col">{children}</div>
    );
}

function LoadingLayout({ children }: React.PropsWithChildren) {
    return (
        <main className="relative flex h-full flex-col items-center justify-center gap-1 justify-self-stretch overflow-auto">
            <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-16">
                <DoubleSharp
                    className="relative h-fit w-fit animate-spin-slow text-white drop-shadow-[0_0_0.3rem_#ffffff70] delay-300"
                    width={130}
                    height="100%"
                />
                {children}
            </div>
        </main>
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
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        setHydrated(true);
    }, []);

    useToken();
    const auth = useAtomValue(AuthAtom);
    const profile = usePrivateProfile();

    if (!hydrated) {
        return (
            <LoadingLayout>
                <p className="loading">애플리케이션을 시작하는 중</p>
            </LoadingLayout>
        );
    }

    if (auth === undefined) {
        return <DefaultLayout>{login}</DefaultLayout>;
    }

    // OTP로 가시오
    if (auth.auth_level === AuthLevel.TEMPORARY) {
        return <DefaultLayout>{otp}</DefaultLayout>;
    }

    // 당신은 정지당했습니다.
    if (auth.auth_level === AuthLevel.BLOCKED) {
        return (
            <DefaultLayout>
                <p>정지당했습니다... 심장이 뛰질 않아요.</p>
                <div className="flex flex-col">
                    {auth.bans.map((e) => (
                        <>
                            <p>{e.reason}</p>
                            <p>
                                {e.expireTimestamp?.toLocaleDateString() ??
                                    "영구"}
                            </p>
                        </>
                    ))}
                </div>
                <button type="button" onClick={() => logout()}>
                    로그아웃
                </button>
            </DefaultLayout>
        );
    }

    if (profile === undefined) {
        return (
            <LoadingLayout>
                <p className="loading">내 정보를 불러오는 중입니다</p>
            </LoadingLayout>
        );
    }

    // 먼저 닉네임을 설정하세요.
    if (profile.nickName === null) {
        return <DefaultLayout>{welcome}</DefaultLayout>;
    }

    // 넌 최고야!
    return (
        <DefaultLayout>
            <ChatSocketProcessor />
            {home}
        </DefaultLayout>
    );
}
