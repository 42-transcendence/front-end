"use client";

import { Icon } from "@/components/ImageLibrary";
import { ChatRoomMenu } from "./ChatRoomMenu";
import { useAtomValue } from "jotai";
import { CurrentChatRoomTitleAtom } from "@/atom/ChatAtom";
import { useEffect, useState } from "react";

function LeftSidebarButton() {
    return (
        <>
            <input
                className="peer/headerleft hidden"
                type="radio"
                name="leftRadio"
                id="leftHeaderIcon"
            />
            <label
                htmlFor="leftHeaderIcon"
                className="absolute left-2 top-2 z-[5] w-12 overflow-clip transition-all duration-500 peer-checked/headerleft:w-0"
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
    return (
        <>
            <input
                className="peer/headerright hidden"
                type="radio"
                name="rightRadio"
                id="rightHeaderIcon"
            />
            <label
                htmlFor="rightHeaderIcon"
                className="absolute right-2 top-2 z-[5] w-12 overflow-clip transition-all duration-500 peer-checked/headerright:w-0"
            >
                <Icon.Members
                    className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                    width={48}
                    height={48}
                />
            </label>
        </>
    );
}

// TODO: isAdmin이 아니라, 어느 채팅방이 열려있는지 정보 받아와야
export function ChatHeader({ isAdmin }: { isAdmin: boolean }) {
    const currentChatRoomTitle = useAtomValue(CurrentChatRoomTitleAtom);

    return (
        <div className="group relative flex h-fit shrink-0 select-none flex-col items-center justify-center self-stretch py-2">
            <LeftSidebarButton />
            <div className="overflow-hidden">
                <label
                    htmlFor="headerDropDown"
                    className="flex h-fit w-fit shrink-0 list-none flex-col justify-center rounded-md p-2 hover:bg-primary/30 active:bg-secondary/80"
                >
                    <div className="relative items-center justify-center gap-2.5 text-base">
                        <div className="flex flex-col items-center justify-center px-4 py-0">
                            <h1 className="line-clamp-1 max-w-[210px] overflow-ellipsis text-center text-[17px] font-bold not-italic leading-[18px] text-white/70">
                                {currentChatRoomTitle === "" ? "채팅방을 선택하세요" : currentChatRoomTitle}
                            </h1>
                            <h2 className="line-clamp-1 overflow-hidden text-ellipsis text-center text-xs font-medium not-italic leading-[normal] text-white/50">
                                채팅을 채팅채팅~
                            </h2>
                        </div>
                    </div>
                </label>
                <input
                    id="headerDropDown"
                    className="peer hidden"
                    type="checkbox"
                />
                <ChatRoomMenu
                    isAdmin={isAdmin}
                    className="hidden peer-checked:flex"
                />
            </div>
            <RightSidebarButton />
        </div>
    );
}
