"use client";

import React, { useState } from "react";
import { IconMembers, IconSearch, IconInvite } from "@/components/ImageLibrary";
import { FzfHighlight, useFzf } from "react-fzf";
import { TextField } from "@/components/TextField";
import { ProfileItem, ProfileItemConfig } from "@/components/ProfileItem";
import { InviteList } from "@/components/Service/InviteList";
import { UUIDSetContainer } from "@/hooks/UUIDSetContext";
import { ButtonOnRight } from "../Button/ButtonOnRight";
import { ChatMemberMenu } from "./ChatMemberMenu";

const profiles: ProfileItemConfig[] = [
    {
        id: 1,
        uuid: "1234",
        name: "hdoo",
        tag: "#00001",
        statusMessage: "Hello world!",
        showStatusMessage: true,
    },
    {
        id: 2,
        uuid: "1234",
        name: "chanhpar",
        tag: "#00002",
        statusMessage: "I'm chanhpar",
        showStatusMessage: true,
    },
    {
        id: 3,
        uuid: "1234",
        name: "iyun",
        tag: "#00003",
        statusMessage: "I'm IU",
        showStatusMessage: true,
    },
    {
        id: 4,
        uuid: "1234",
        name: "jkong",
        tag: "#00004",
        statusMessage: "I'm Jkong!",
        showStatusMessage: true,
    },
    {
        id: 5,
        uuid: "1234",
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
    const [checked, setChecked] = useState(false);
    // TODO: setAdmin logic
    const [admin, setAdmin] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        //TODO: invite selected ids;
    };

    return (
        <div className="absolute right-0 z-10 h-full w-[310px] min-w-[310px] select-none overflow-clip text-gray-200/80 transition-all duration-100 peer-checked/right:w-0 peer-checked/right:min-w-0 2xl:relative 2xl:flex 2xl:rounded-[28px_0px_0px_28px]">
            <div className="flex h-full w-full shrink-0 flex-col items-start gap-2 bg-black/30 px-4 py-2 backdrop-blur-[20px] 2xl:py-4">
                <div className="flex h-fit shrink-0 flex-row items-start justify-between gap-4 self-stretch 2xl:py-2">
                    <label htmlFor="rightSideBarIcon">
                        <IconMembers
                            className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                            width={48}
                            height={48}
                        />
                    </label>
                    <div className="w-full overflow-hidden">
                        <label
                            htmlFor="memberListDropDown"
                            className={`flex h-12 w-full items-center justify-center gap-2 rounded-md p-4 ${
                                admin &&
                                "hover:bg-primary/30 hover:text-white active:bg-secondary/80"
                            }`}
                        >
                            <p className="w-fit font-sans text-base leading-4 ">
                                멤버 목록
                            </p>
                        </label>
                        <input
                            id="memberListDropDown"
                            className="peer hidden"
                            type="checkbox"
                        />
                        <ChatMemberMenu
                            isAdmin={admin}
                            className="hidden peer-checked:flex"
                        />
                    </div>

                    <input
                        onClick={() => setChecked(!checked)}
                        checked={checked}
                        id="invite"
                        type="checkbox"
                        className="hidden"
                    />
                    <label
                        htmlFor="invite"
                        data-checked={checked}
                        title="invite"
                        className="group"
                    >
                        <IconInvite
                            className="shrink-0 rounded-md p-1 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80 group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50"
                            width={48}
                            height={48}
                        />
                    </label>
                </div>
                {checked ? (
                    <UUIDSetContainer>
                        {/* TODO: complete form!! & add invite button */}
                        <form
                            className="h-full w-full overflow-auto"
                            onSubmit={handleSubmit}
                        >
                            <div className="flex h-full w-full flex-col justify-between gap-4">
                                <InviteList className="overflow-auto" />
                                <ButtonOnRight
                                    buttonText="초대하기"
                                    className="relative flex rounded-lg bg-gray-700/80 p-3 text-lg group-valid:bg-green-700/80"
                                />
                            </div>
                        </form>
                    </UUIDSetContainer>
                ) : (
                    <>
                        <TextField
                            type="search"
                            icon={
                                <IconSearch
                                    className="absolute left-1 right-1 top-1 select-none rounded-lg p-1 transition-all group-focus-within:left-[15.5rem] group-focus-within:bg-secondary group-focus-within:text-white"
                                    width={24}
                                    height={24}
                                />
                            }
                            className="py-1 pl-7 pr-2 text-sm transition-all focus-within:pl-2 focus-within:pr-9"
                            value={query}
                            placeholder="Search..."
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <div className="h-fit w-full overflow-auto">
                            {results.map((item, index) => (
                                <ProfileItem
                                    type="social"
                                    key={item.id}
                                    config={item}
                                    selected={item.id === selectedId}
                                    onClick={() => {
                                        setSelectedId(
                                            item.id !== selectedId
                                                ? item.id
                                                : undefined,
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
                    </>
                )}
            </div>
        </div>
    );
}
