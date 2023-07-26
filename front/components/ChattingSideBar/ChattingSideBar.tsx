import React from "react";
import { Icon } from "../Icon/Icon";
import ChattingRoomBlock from "../ChattingRoomBlock/ChattingRoomBlock";
import "./style.css";

export default function ChattingSideBar() {
    return (
        <div>
            <div className="flex h-[1203px] w-[350px] shrink-0 flex-col items-start gap-2 rounded-[0px_28px_28px_0px] p-4 backdrop-blur-[50px]">
                <div className="flex h-16 shrink-0 items-center justify-between self-stretch px-2 py-4">
                    <div className="flex w-fit items-center gap-2 self-stretch rounded-md">
                        <Icon type="edit" size={40} className="" />
                        <p className=" font-sm font-sans leading-4 text-gray-50 ">
                            Chat
                        </p>
                    </div>
                    <Icon type="sidebar" size={20} className="" />
                </div>

                {/* searchBar */}
                <div className="rounded-xl; flex h-8 shrink-0 items-center gap-2 self-stretch px-2 py-0">
                    <div className="flex h-8 w-[305px] shrink-0 items-center gap-2 self-stretch rounded-xl px-2 py-0 shadow-[1px_1.5px_4px_0px_rgba(0,0,0,0.10)_inset,1px_1.5px_4px_0px_rgba(0,0,0,0.08)_inset,0px_-0.5px_1px_0px_rgba(255,255,255,0.25)_inset,0px_-0.5px_1px_0px_rgba(255,255,255,0.30)_inset]">
                        {/* <Icon className="float-left" type="search" size={30} /> */}
                        <div className="flex-[1_0_0] overflow-hidden text-ellipsis text-sm font-normal not-italic leading-[22px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                            <input className="w-[260px] border-[none] bg-transparent"></input>
                        </div>
                        <Icon className="float-left" type="search" size={30} />
                    </div>
                </div>

                <ChattingRoomBlock />
                <ChattingRoomBlock />
                <ChattingRoomBlock />
                <ChattingRoomBlock />
            </div>
        </div>
    );
}
