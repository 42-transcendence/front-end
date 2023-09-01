"use client";

import { editPanelVisibilityAtom } from "@/atom/ProfileAtom";
import { AchievementPanel } from "@/components/Profile/AchievementPanel";
import { EditPanel } from "@/components/Profile/EditPanel";
import { GameHistoryPanel } from "@/components/Profile/GameHistoryPanel";
import { ProfileSection } from "@/components/Profile/ProfileSection";
import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

function ErrorPage() {
    return <div>invalid profile id</div>;
}

function isValidProfileId(id: string | string[]) {
    if (!Array.isArray(id)) return false;
    return id.length === 1 && Number.isInteger(Number(id));
}

export default function ProfilePage() {
    const params = useParams();
    const editPanelVisibility = useAtomValue(editPanelVisibilityAtom);

    // TODO: 실제 로직으로 변경. game id 쪽 일단 복붙해옴. 같이 수정 요망
    const paramKeys = Object.keys(params);
    if (paramKeys.length !== 1 || paramKeys[0] !== "id") {
        return <ErrorPage />;
    }

    if (!isValidProfileId(params.id)) {
        return <ErrorPage />;
    }

    // TODO: change to real uuid
    const accountUUID = params.id as string;
    return (
        <>
            <ProfileSection accountUUID={accountUUID} />
            <div className="grid h-full w-full grid-cols-1 gap-8 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4 lg:p-8">
                {editPanelVisibility && <EditPanel />}
                {/*TODO: put accountUUID of selected user */}
                <AchievementPanel accountUUID={accountUUID} />
                <GameHistoryPanel accountUUID={accountUUID} />
            </div>
        </>
    );
}
