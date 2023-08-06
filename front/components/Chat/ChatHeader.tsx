/* eslint-disable react/jsx-no-undef */
import React from "react";
import { ProfileItemConfig } from "../ContextMenu";
import SidebarIcon from "/public/sidebar.svg";
import MembersIcon from "/public/members.svg";
import { ChatRoomMenu } from "./ChatRoomMenu";

const config: ProfileItemConfig = {
    id: 1,
    tag: "#0001",
    name: "hdoo",
    statusMessage: "hello",
};

export function ChatHeader() {
    return (
        <details className="m-6 flex select-none flex-col  justify-between self-stretch">
            <summary className="flex flex-row justify-between">
                <button>
                    <SidebarIcon
                        className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                        width={48}
                        height={48}
                    />
                </button>
                <div className="flex items-center justify-center gap-2.5 text-base backdrop-blur-[50px]">
                    <div className="flex flex-col items-center justify-center px-4 py-0">
                        <div className="text-center text-[17px] font-bold not-italic leading-[18px] text-white/70">
                            chatting room
                        </div>
                        <div className="overflow-hidden text-ellipsis text-center text-xs font-medium not-italic leading-[normal] text-white/50">
                            채팅을 채팅채팅~
                        </div>
                    </div>
                </div>
                <button>
                    <MembersIcon
                        className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                        width={48}
                        height={48}
                    />
                </button>
            </summary>
            <ChatRoomMenu />
        </details>
    );
}
