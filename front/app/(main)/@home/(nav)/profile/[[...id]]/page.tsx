"use client";

import { AchievementPenal } from "@/components/Profile/AchievementPenal";
import { Panel } from "@/components/Profile/Panel";

export default function ProfilePage() {
    return (
        <div className="grid h-full w-full grid-cols-1 gap-8 overflow-auto p-8 md:grid-cols-2 lg:grid-cols-4">
            <Panel className="md:col-span-2 lg:col-span-4 lg:row-span-2"></Panel>
            <AchievementPenal accountUUID={""} />
            <AchievementPenal accountUUID={""} />
        </div>
    );
}
