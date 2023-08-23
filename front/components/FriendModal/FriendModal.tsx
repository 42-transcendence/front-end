"use client";

import "./style.css";
import { useState } from "react";
import { ProfileItem } from "@/components/ProfileItem";
import type { ProfileItemConfig } from "@/components/ProfileItem";

//TODO change contents with query data.
const profiles: ProfileItemConfig[] = [
    {
        id: 1,
        name: "hdoo",
        tag: "#00001",
        statusMessage: "Hello world!",
        uuid: "asdf",
    },
    {
        id: 2,
        name: "chanhpar",
        tag: "#00002",
        statusMessage: "I'm chanhpar",
        uuid: "asdf",
    },
    {
        id: 3,
        name: "iyun",
        tag: "#00003",
        statusMessage: "I'm IU",
        uuid: "asdf",
    },
    {
        id: 4,
        name: "jkong",
        tag: "#00004",
        statusMessage: "I'm Jkong!",
        uuid: "asdf",
    },
    {
        id: 5,
        name: "jisookim",
        tag: "#00005",
        statusMessage: "Hi I'm jisoo",
        uuid: "asdf",
    },
];

export function FriendModal() {
    const [selectedId, setSelectedId] = useState<number>();
    //TODO: fetch profile datas

    return (
        <div className="gradient-border relative flex w-[262px] flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-['']">
            <div className="w-full overflow-clip rounded-[28px] ">
                {profiles.map((profile: ProfileItemConfig) => (
                    <ProfileItem
                        type="friend"
                        key={profile.id}
                        info={profile}
                        selected={profile.id === selectedId}
                        onClick={() => {
                            setSelectedId(
                                profile.id !== selectedId
                                    ? profile.id
                                    : undefined,
                            );
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
