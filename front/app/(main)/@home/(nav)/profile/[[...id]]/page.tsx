"use client";

import { AchievementPenal } from "@/components/Profile/AchievementPenal";
import { Panel } from "@/components/Profile/Panel";

export default function ProfilePage() {
    return (
        <div className="grid h-full w-full gap-8 overflow-auto p-8 md:grid-cols-2 2xl:grid-cols-3">
            <AchievementPenal />
            <Panel className=""></Panel>
            <Panel className=""></Panel>
            <Panel className=""></Panel>
        </div>
    );
}
