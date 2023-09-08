"use client";

import { EditPanelVisibilityAtom } from "@atoms/ProfileAtom";
import { RoundButtonBase } from "@components/Button/RoundButton";
import { AchievementPanel } from "@components/Profile/AchievementPanel";
import { EditPanel } from "@components/Profile/EditPanel";
import { GameHistoryPanel } from "@components/Profile/GameHistoryPanel";
import { ProfileSection } from "@components/Profile/ProfileSection";
import { useNickLookup, usePrivateProfile } from "@hooks/useProfile";
import { NICK_NAME_REGEX } from "@common/profile-constants";
import type { AccountProfileProtectedPayload } from "@common/profile-payloads";
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

function parseNickAndTag(
    params: { id?: string[] | undefined },
    profile: AccountProfileProtectedPayload | undefined,
): [nick: string, tag: number, isValid: boolean] {
    const paramKeys = Object.keys(params);
    const isValid =
        profile !== undefined &&
        paramKeys.length === 1 &&
        paramKeys[0] === "id" &&
        isValidProfileId(params.id);

    const [nick, tag] =
        params.id !== undefined
            ? [params.id[0], Number(params.id[1])]
            : profile !== undefined
            ? [profile.nickName ?? "", profile.nickTag]
            : ["", 0];

    return [nick, tag, isValid];
}

export default function ProfilePage({
    params,
}: {
    params: { id?: string[] | undefined };
}) {
    const profile = usePrivateProfile();
    const [nick, tag, isValid] = parseNickAndTag(params, profile);
    const { accountUUID, isLoading, notFound } = useNickLookup(nick, tag);
    const editPanelVisibility = useAtomValue(EditPanelVisibilityAtom);

    if (!isValid) {
        return <ErrorPage />;
    }

    if (notFound) {
        return <ErrorPage />;
    }

    return (
        <>
            <ProfileSection accountUUID={accountUUID} />
            <div className="grid h-full w-full grid-cols-1 gap-8 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4 lg:p-8">
                {editPanelVisibility && <EditPanel />}
                <AchievementPanel accountUUID={accountUUID} />
                {!isLoading && <GameHistoryPanel accountUUID={accountUUID} />}
            </div>
        </>
    );
}
