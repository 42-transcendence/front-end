"use client";

import React from "react";
import { ProfileItemConfig } from "../ContextMenu";
import SidebarIcon from "/public/sidebar.svg";
import MembersIcon from "/public/members.svg";
import HamburgerIcon from "/public/hamburger.svg";
import { ChatRoomMenu } from "./ChatRoomMenu";

const config: ProfileItemConfig = {
    id: 1,
    tag: "#0001",
    name: "hdoo",
    statusMessage: "hello",
};

export function ChatHeader() {
    return (
        <div className="group relative m-5 flex shrink-0 select-none flex-col justify-center self-stretch">
            <input
                className="peer/headerleft hidden"
                type="radio"
                name="leftRadio"
                id="leftHeaderIcon"
            />
            <label
                htmlFor="leftHeaderIcon"
                className="absolute left-0 top-0 w-12 overflow-clip transition-all duration-500 peer-checked/headerleft:w-0"
            >
                <SidebarIcon
                    className="hidden rounded-md p-3 text-gray-200/80 hover:bg-primary/30 active:bg-secondary/80 lg:block"
                    width={48}
                    height={48}
                />
                <HamburgerIcon
                    className="rounded-md p-3 text-gray-200/80 hover:bg-primary/30 hover:text-white active:bg-secondary/80 lg:hidden"
                    width={48}
                    height={48}
                />
            </label>
            <details className="h-12 overflow-hidden transition-all duration-500 open:h-72">
                <summary className="flex w-full flex-row justify-center">
                    <div className="relative items-center justify-center gap-2.5 text-base">
                        <div className="flex flex-col items-center justify-center px-4 py-0">
                            <div className="text-center text-[17px] font-bold not-italic leading-[18px] text-white/70">
                                chatting room
                            </div>
                            <div className="overflow-hidden text-ellipsis text-center text-xs font-medium not-italic leading-[normal] text-white/50">
                                채팅을 채팅채팅~
                            </div>
                        </div>
                    </div>
                </summary>
                <ChatRoomMenu isAdmin={true} />
            </details>
            <button>
                <input
                    className="peer/headerright hidden"
                    type="radio"
                    name="rightRadio"
                    id="rightHeaderIcon"
                />
                <label
                    htmlFor="rightHeaderIcon"
                    className="absolute right-0 top-0 w-12 overflow-clip transition-all duration-500 peer-checked/headerright:w-0"
                >
                    <MembersIcon
                        className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                        width={48}
                        height={48}
                    />
                </label>
            </button>
        </div>
    );
}
