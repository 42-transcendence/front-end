/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import { Icon } from "../Icon/Icon";
import { ContextMenu_Social } from "../ContextMenu/ContextMenu_Social";
import { ProfileItemConfig } from "../ContextMenu";

const config: ProfileItemConfig = {
    id: 1,
    tag: "#0001",
    name: "hdoo",
    statusMessage: "hello",
};

export function ChatHeader({}): React.ReactElement {
    const [opened, setOpened] = useState(false);

    return (
        <div className="m-6 flex justify-between self-stretch ">
            <button>
                <Icon type="sidebar" size={20} className="" />
            </button>
            <div className="flex items-center justify-center gap-2.5 text-base backdrop-blur-[50px]">
                <div className="flex flex-col items-center justify-center px-4 py-0">
                    <div className="text-center text-[17px] font-bold not-italic leading-[18px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                        chatting room
                    </div>
                    <div className="overflow-hidden text-ellipsis text-center text-xs font-medium not-italic leading-[normal] text-[color:var(--text-tertiary,rgba(255,255,255,0.11))]">
                        채팅을 채팅채팅~
                    </div>
                </div>
            </div>
            <button>
                <Icon type="friend" size={40} className="float flex" />
            </button>
            {opened && <ContextMenu_Social profile={config} />}
        </div>
    );
}