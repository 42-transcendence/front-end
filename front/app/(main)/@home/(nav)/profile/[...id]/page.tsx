"use client";

import { EditPanelVisibilityAtom } from "@atoms/ProfileAtom";
import { RoundButtonBase } from "@components/Button/RoundButton";
import { AchievementPanel } from "@components/Profile/AchievementPanel";
import { EditPanel } from "@components/Profile/EditPanel";
import { GameHistoryPanel } from "@components/Profile/GameHistoryPanel";
import { ProfileSection } from "@components/Profile/ProfileSection";
import { useNickLookup } from "@hooks/useProfile";
import { NICK_NAME_REGEX } from "@common/profile-constants";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useToken } from "@hooks/useToken";

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

function isValidProfileId(params: string[]) {
    const regexp = NICK_NAME_REGEX;
    return (
        params.length === 2 &&
        regexp.test(params[0]) &&
        Number.isSafeInteger(Number(params[1]))
    );
}

function parseParams(
    params: string[],
): [nick: string, tag: number, isValid: boolean] {
    const isValid = isValidProfileId(params);
    const [nick, tag] = isValid ? [params[0], Number(params[1])] : ["", 0];

    return [nick, tag, isValid];
}

export default function ProfilePage({ params }: { params: { id: string[] } }) {
    useToken();
    const decodedParams = params.id.map((e) => decodeURIComponent(e));
    const [nick, tag, isValid] = parseParams(decodedParams);
    const { accountUUID, isLoading, notFound } = useNickLookup(nick, tag);
    const editPanelVisibility = useAtomValue(EditPanelVisibilityAtom);

    if (!isValid || notFound || accountUUID === "") {
        return <ErrorPage />;
    }

    return (
        <>
            <ProfileSection accountUUID={accountUUID} />
            <div className="flex h-fit w-full flex-col gap-8 overflow-auto p-4 md:grid md:grid-cols-2 lg:h-full lg:grid-cols-4 lg:p-8">
                {editPanelVisibility && <EditPanel />}
                <AchievementPanel accountUUID={accountUUID} />
                {!isLoading && <GameHistoryPanel accountUUID={accountUUID} />}
            </div>
        </>
    );
}
