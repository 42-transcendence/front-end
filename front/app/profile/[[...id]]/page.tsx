"use client";

import { EditPanelVisibilityAtom } from "@/atom/ProfileAtom";
import { RoundButtonBase } from "@/components/Button/RoundButton";
import { AchievementPanel } from "@/components/Profile/AchievementPanel";
import { EditPanel } from "@/components/Profile/EditPanel";
import { GameHistoryPanel } from "@/components/Profile/GameHistoryPanel";
import { ProfileSection } from "@/components/Profile/ProfileSection";
import { useNickLookup, usePrivateProfile } from "@/hooks/useProfile";
import { NICK_NAME_REGEX } from "@/library/payload/profile-constants";
import { useAtomValue } from "jotai";
import Link from "next/link";

function ErrorPage() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-16">
            <span>Page not found</span>
            <Link className="relative" href="/">
                <RoundButtonBase>Back To Home</RoundButtonBase>
            </Link>
        </div>
    );
}

function isValidProfileId(params: string[] | undefined) {
    if (!Array.isArray(params)) return false;
    const regexp = NICK_NAME_REGEX;
    return (
        params.length === 2 &&
        regexp.test(params[0]) &&
        Number.isInteger(Number(params[1]))
    );
}

export default function ProfilePage({
    params,
}: {
    params: { id?: string[] | undefined };
}) {
    const profile = usePrivateProfile();
    const nick =
        params.id !== undefined ? params.id[0] : profile?.nickName ?? "";
    const tag =
        params.id !== undefined ? Number(params.id[1]) : profile?.nickTag ?? 0;
    const result = useNickLookup(nick, tag);
    const editPanelVisibility = useAtomValue(EditPanelVisibilityAtom);
    const accountUUID = result.accountUUID;

    if (profile === undefined) {
        return <ErrorPage />;
    }

    if (result.notFound) {
        return <ErrorPage />;
    }
    if (result.isLoading) {
        return (
            <>
                <ProfileSection accountUUID={accountUUID} />
                <div className="grid h-full w-full grid-cols-1 gap-8 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4 lg:p-8">
                    {editPanelVisibility && <EditPanel />}
                    <AchievementPanel accountUUID={accountUUID} />
                </div>
            </>
        );
    }
    const paramKeys = Object.keys(params);
    if (paramKeys.length !== 1 || paramKeys[0] !== "id") {
        return <ErrorPage />;
    }
    if (!isValidProfileId(params.id)) {
        return <ErrorPage />;
    }

    return (
        <>
            <ProfileSection accountUUID={accountUUID} />
            <div className="grid h-full w-full grid-cols-1 gap-8 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4 lg:p-8">
                {editPanelVisibility && <EditPanel />}
                <AchievementPanel accountUUID={accountUUID} />
                <GameHistoryPanel accountUUID={accountUUID} />
            </div>
        </>
    );
}
