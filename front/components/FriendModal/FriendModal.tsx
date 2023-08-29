"use client";

import { useState } from "react";
import { ProfileItem } from "@/components/ProfileItem";
import type { ProfileItemConfig } from "@/components/ProfileItem";
import { ProfileItemBase } from "../ProfileItem/ProfileItemBase";
import { Avatar } from "../Avatar";
import { Icon } from "../ImageLibrary";
import { Provider, createStore, useAtomValue } from "jotai";
import { useWebSocket } from "@/library/react/websocket-hook";
import {
    FriendRequestEntryAtom,
    FriendRequestUUIDAtom,
} from "@/atom/FriendAtom";
import { AccountProfilePublicPayload } from "@/library/payload/profile-payloads";
import useSWR from "swr";
import { fetcher } from "@/hooks/fetcher";

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
    //TODO: fetch profile datas

    return (
        <div className="gradient-border relative flex w-[262px] flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-['']">
            <div className="w-full overflow-clip rounded-[28px] ">
                <InviteList />
                <FriendList />
            </div>
        </div>
    );
}

function FriendList() {
    const [selectedId, setSelectedId] = useState<number>();

    return profiles.map((profile: ProfileItemConfig) => (
        <ProfileItem
            type="friend"
            key={profile.id}
            info={profile}
            selected={profile.id === selectedId}
            onClick={() => {
                setSelectedId(
                    profile.id !== selectedId ? profile.id : undefined,
                );
            }}
        />
    ));
}

function InviteList() {
    const accountUUIDs = useAtomValue(FriendRequestEntryAtom);
    return (
        <div className="flex flex-col gap-2 py-2">
            <InviteHeader />
            {accountUUIDs.map((accountUUID) => (
                <InviteItem key={accountUUID} accountUUID={accountUUID} />
            ))}
            <div className="mx-4 h-[1px] bg-white/30" />
        </div>
    );
}

function InviteItem({ accountUUID }: { accountUUID: string }) {
    const store = createStore();
    store.set(FriendRequestUUIDAtom, accountUUID);

    const { data } = useSWR(
        `/profile/public/${accountUUID}`,
        fetcher<AccountProfilePublicPayload>,
    );
    //TODO: add suspend skeleton;
    //TODO: refactor profile part

    return (
        <Provider store={store}>
            <div className="flex flex-row justify-between px-4 py-2 hover:bg-primary/30">
                <div className="flex flex-row gap-2">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            className="h-10 w-10"
                            accountUUID={accountUUID}
                            privileged={false}
                        />
                    </div>
                    <div className="relative flex w-fit flex-col items-start justify-center gap-1">
                        <p className="relative w-fit select-none whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                            {data?.nickName}
                        </p>
                        <p className="relative w-fit select-none whitespace-nowrap font-sans text-xs font-normal leading-none tracking-normal text-gray-300/60">
                            {data?.nickTag}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 px-4">
                    <button>
                        <Icon.Check
                            width={24}
                            height={24}
                            className="rounded-full bg-green-500 p-1.5 text-white/90"
                        />
                    </button>
                    <button>
                        <Icon.X
                            width={24}
                            height={24}
                            className="rounded-full bg-red-500 p-1.5 text-white/90"
                        />
                    </button>
                </div>
            </div>
        </Provider>
    );
}

function InviteHeader() {
    return (
        <div className="flex flex-col justify-start">
            <span className="p-4 text-base font-extrabold  text-white/90">
                친구 요청
            </span>
        </div>
    );
}
