"use client";

import { AchievementPenal } from "@/components/Profile/AchievementPenal";
import { GameHistoryPanel } from "@/components/Profile/GameHistorySection";
import { Panel } from "@/components/Profile/Panel";

export default function ProfilePage() {
    return (
        <div className="grid overflow-auto grid-cols-1 gap-8 p-4 w-full h-full md:grid-cols-2 lg:grid-cols-4 lg:p-8">
            <Panel className="md:col-span-2 lg:col-span-4 lg:row-span-2"></Panel>
            <AchievementPenal accountUUID={""} />
            <GameHistoryPanel accountUUID={""} />
        </div>
    );
}
