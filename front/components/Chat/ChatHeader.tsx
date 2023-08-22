"use client";

import React, { useState } from "react";
import { ProfileItemConfig } from "../ContextMenu";
import { Icon } from "@/components/ImageLibrary";
import { ChatRoomMenu } from "./ChatRoomMenu";

const config: ProfileItemConfig = {
    id: 1,
    tag: "#0001",
    name: "hdoo",
    statusMessage: "hello",
};

export function ChatHeader() {
    const [admin, setAdmin] = useState(true);
    const [open, setOpen] = useState(false);

    return (
        <div className="group relative flex h-fit shrink-0 select-none flex-col items-center justify-center self-stretch py-2">
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
            <div className="overflow-hidden">
                <label
                    htmlFor="headerDropDown"
                    className="flex h-fit w-fit shrink-0 list-none flex-col justify-center rounded-md p-2 hover:bg-primary/30 active:bg-secondary/80"
                >
                    <div className="relative items-center justify-center gap-2.5 text-base">
                        <div className="flex flex-col items-center justify-center px-4 py-0">
                            <h1 className="line-clamp-1 max-w-[210px] overflow-ellipsis text-center text-[17px] font-bold not-italic leading-[18px] text-white/70">
                                일이삼사오육칠팔구십일이삼사오육칠팔구십
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
                    isAdmin={admin}
                    className="hidden peer-checked:flex"
                />
            </div>
            <button>
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
            </button>
        </div>
    );
}
