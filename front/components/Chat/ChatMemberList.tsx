"use client";

import React, { useState } from "react";
import {
    IconMembers,
    IconSetting,
    IconSearch,
} from "@/components/ImageLibrary";
import { FzfHighlight, useFzf } from "react-fzf";
import { TextField } from "../TextField";
import { ProfileItem, ProfileItemConfig } from "../ProfileItem";

type User = {
    id: number;
    name: string;
};

const profiles: ProfileItemConfig[] = [
    {
        id: 1,
        name: "hdoo",
        tag: "#00001",
        statusMessage: "Hello world!",
        showStatusMessage: true,
    },
    {
        id: 2,
        name: "chanhpar",
        tag: "#00002",
        statusMessage: "I'm chanhpar",
        showStatusMessage: true,
    },
    {
        id: 3,
        name: "iyun",
        tag: "#00003",
        statusMessage: "I'm IU",
        showStatusMessage: true,
    },
    {
        id: 4,
        name: "jkong",
        tag: "#00004",
        statusMessage: "I'm Jkong!",
        showStatusMessage: true,
    },
    {
        id: 5,
        name: "jisookim",
        tag: "#00005",
        statusMessage: "Hi I'm jisoo",
        showStatusMessage: true,
    },
];

// TODO: displaytitle을 front-end에서 직접 정하는게 아니라, 백엔드에서 없으면
// 동일 로직으로 타이틀을 만들어서 프론트에 넘겨주고, 프론트에선 타이틀을 항상
// 존재하는 프로퍼티로 추후 변경할 수도

export default function ChatMemberList() {
    const [selectedId, setSelectedId] = useState<number>();
    const [query, setQuery] = useState("");
    const { results, getFzfHighlightProps } = useFzf({
        items: profiles,
        itemToString(item) {
            return item.name;
        },
        limit: 5,
        query,
    });

    return (
        <div className="absolute right-0 z-10 h-full w-[310px] min-w-[310px] select-none overflow-clip text-gray-200/80 transition-all duration-100 peer-checked/right:w-0 peer-checked/right:min-w-0 2xl:relative 2xl:flex">
            <div className="float-left flex h-full w-full shrink-0 flex-col items-start gap-2 bg-black/30 p-4 backdrop-blur-[50px] before:rounded-[28px] before:p-px before:content-[''] 2xl:rounded-[28px_0px_0px_28px]">
                <div className="flex h-16 shrink-0 flex-row items-center justify-between self-stretch">
                    <label htmlFor="rightSideBarIcon">
                        <IconMembers
                            className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                            width={48}
                            height={48}
                        />
                    </label>
                    <div className="flex h-12 items-center gap-2 rounded-md p-4 hover:bg-primary/30 hover:text-white active:bg-secondary/80">
                        <p className="font-sans text-base leading-4 ">
                            친구 목록
                        </p>
                    </div>
                    <IconSetting
                        className="shrink-0 rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                        width={48}
                        height={48}
                    />
                </div>

                <TextField
                    icon={
                        <IconSearch
                            className="absolute left-1 right-1 top-1 select-none rounded-lg p-1 transition-all group-focus-within:left-[15.5rem] group-focus-within:bg-secondary group-focus-within:text-white"
                            width={24}
                            height={24}
                        />
                    }
                    className="py-1 pl-7 pr-2 transition-all focus-within:pl-2 focus-within:pr-9"
                    value={query}
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                ></TextField>

                {results.map((item, index) => (
                    <ProfileItem
                        className="rounded-md"
                        key={item.id}
                        config={item}
                        selected={item.id === selectedId}
                        onClick={() => {
                            setSelectedId(
                                item.id !== selectedId ? item.id : undefined,
                            );
                        }}
                    >
                        <FzfHighlight
                            {...getFzfHighlightProps({
                                index,
                                item,
                                className: "text-yellow-500",
                            })}
                        />
                    </ProfileItem>
                ))}
            </div>
        </div>
    );
}
