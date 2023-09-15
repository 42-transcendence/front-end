"use client";

import { Icon } from "@components/ImageLibrary";
import { ChatRoomMenu } from "./ChatRoomMenu";
import { useCurrentChatRoomUUID } from "@hooks/useCurrent";
import { useChatRoomTitle } from "@hooks/useChatRoom";
import { useAtom } from "jotai";
import { LeftSideBarIsOpenAtom, RightSideBarIsOpenAtom } from "@atoms/ChatAtom";
import { useEffect } from "react";
import {
    extractTargetFromDirectChatKey,
    isDirectChatKey,
} from "@akasha-utils/idb/chat-store";
import { useProtectedProfile } from "@hooks/useProfile";
import { NickBlock } from "@components/ProfileItem/ProfileItem";

export function RightSideBarInput() {
    const [{ close }, setToOpen] = useAtom(RightSideBarIsOpenAtom);

    return (
        <input
            className="peer/right invisible absolute"
            type="radio"
            onClick={() => setToOpen(false)}
            onChange={() => {}}
            checked={close}
            name="rightRadio"
            id="rightSideBarIcon"
        />
    );
}

export function LeftSideBarInput() {
    const [{ close }, setToOpen] = useAtom(LeftSideBarIsOpenAtom);

    return (
        <input
            className="peer/left invisible absolute"
            type="radio"
            onChange={() => setToOpen(false)}
            checked={close}
            name="leftRadio"
            id="forCloseLeftSideBar"
        />
    );
}

function LeftSidebarButton() {
    const currentChatRoom = useCurrentChatRoomUUID();

    const [{ open }, setToOpen] = useAtom(LeftSideBarIsOpenAtom);

    useEffect(() => {
        if (currentChatRoom === "") {
            setToOpen(true);
        }
    }, [currentChatRoom, setToOpen]);

    return (
        <>
            <input
                readOnly
                className="peer/headerleft hidden"
                checked={open}
                onClick={() => setToOpen(true)}
                onChange={() => {}}
                type="radio"
                name="leftRadio"
                id="forOpenLeftSideBar"
            />
            <label
                htmlFor="forOpenLeftSideBar"
                className="absolute left-4 top-4 z-[5] w-12 overflow-clip transition-all duration-500 peer-checked/headerleft:w-0"
            >
                <Icon.Sidebar
                    className="hidden rounded-md p-3 text-gray-200/80 hover:bg-primary/30 active:bg-secondary/80 2xl:block"
                    width={48}
                    height={48}
                />
                <Icon.Hamburger
                    className="rounded-md p-3 text-gray-200/80 hover:bg-primary/30 hover:text-white active:bg-secondary/80 2xl:hidden"
                    width={48}
                    height={48}
                />
            </label>
        </>
    );
}

function RightSidebarButton() {
    const [{ open }, setToOpen] = useAtom(RightSideBarIsOpenAtom);

    return (
        <>
            <input
                className="peer/headerright hidden"
                checked={open}
                onChange={() => setToOpen(true)}
                type="radio"
                name="rightRadio"
                id="rightHeaderIcon"
            />
            <label
                htmlFor="rightHeaderIcon"
                className="absolute right-4 top-4 z-[5] w-12 overflow-clip transition-all duration-500 peer-checked/headerright:w-0"
            >
                <Icon.MembersFilled
                    className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                    width={48}
                    height={48}
                />
            </label>
        </>
    );
}

export function ChatHeader() {
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const currentChatRoomTitle = useChatRoomTitle(currentChatRoomUUID);
    const currentChatRoomIsDirect = isDirectChatKey(currentChatRoomUUID);
    const roomType = currentChatRoomIsDirect ? "다이렉트 메시지" : "그룹 채팅";
    const targetProfile = useProtectedProfile(
        currentChatRoomIsDirect
            ? extractTargetFromDirectChatKey(currentChatRoomUUID)
            : "",
    );

    const title = currentChatRoomIsDirect ? (
        <NickBlock profile={targetProfile} />
    ) : (
        currentChatRoomTitle ?? "채팅방을 선택하세요"
    );

    return (
        <div className="group relative flex h-fit shrink-0 select-none flex-col items-center justify-center self-stretch bg-transparent py-4">
            <LeftSidebarButton />
            <div className="overflow-hidden">
                <label
                    htmlFor="headerDropDown"
                    className={[
                        "flex h-fit w-fit shrink-0 list-none flex-col justify-center rounded-md p-2",
                        !currentChatRoomIsDirect &&
                            "active:bg-secondary/8 hover:bg-primary/30",
                    ].join(" ")}
                >
                    {currentChatRoomUUID !== "" && (
                        <div className=" relative flex flex-col items-center justify-center px-4 py-0 text-base">
                            <h1 className="line-clamp-1 max-w-[16rem] overflow-ellipsis text-center text-[17px] font-bold not-italic leading-[18px] text-white/70 sm:max-w-full">
                                {title}
                            </h1>
                            <div className="flex flex-row gap-2">
                                <h2 className="line-clamp-1 overflow-hidden text-ellipsis text-center text-xs font-medium not-italic leading-[normal] text-white/50">
                                    {roomType}
                                </h2>
                            </div>
                        </div>
                    )}
                </label>
                <input
                    id="headerDropDown"
                    className="peer hidden"
                    type="checkbox"
                />
                {!currentChatRoomIsDirect && (
                    <ChatRoomMenu className="hidden peer-checked:flex" />
                )}
            </div>
            {!currentChatRoomIsDirect && <RightSidebarButton />}
        </div>
    );
}
