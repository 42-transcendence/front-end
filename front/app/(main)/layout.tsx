"use client";

import { AuthLevel } from "@/library/payload/auth-payload";
import { AuthAtom, CurrentAccountUUIDAtom } from "@/atom/AccountAtom";
import { useAtomValue } from "jotai";
import { ChatSocketProcessor } from "./ChatSocketProcessor";
import { usePrivateProfile } from "@/hooks/useProfile";

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
    const auth = useAtomValue(AuthAtom);
    const profile = usePrivateProfile();

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
                {auth.bans.map((e) => (
                    <>
                        <p>{e.reason}</p>
                        <p>{e.expireTimestamp?.toString() ?? "영구"}</p>
                    </>
                ))}
            </DefaultLayout>
        );
    }

    if (profile === undefined) {
        return (
            <DefaultLayout>
                <p>내 정보를 불러오는 중입니다...</p>
            </DefaultLayout>
        );
    }

    //TODO: 탈퇴 유예기간인 경우
    // if (auth?.auth_level === AuthLevel.UNREGISTERING) {
    //     return <DefaultLayout>{???}</DefaultLayout>
    // }

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
