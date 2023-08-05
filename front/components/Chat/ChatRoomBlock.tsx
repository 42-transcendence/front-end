"use client";
import React, { ReactNode } from "react";
import LockIcon from "/public/lock.svg";
// import Image from "next/image";
// import { useState } from "react";
import { ChatRoomInfo } from "./ChatSideBar";
import { Avatar } from "../Avatar";

// type AvatarProp = {
//     profileImage: string;
//     userStatus:
//     | "online"
//     | "invisible"
//     | "offline"
//     | "idle"
//     | "matching"
//     | "do-not-disturb"
//     | "in-game";
// };

// const dummyAvatar: AvatarProp = {
//     profileImage: "/jisookim.png",
//     userStatus: "in-game",
// };

export default function ChatRoomBlock({
    children,
    chatRoom,
}: {
    children: ReactNode;
    chatRoom: ChatRoomInfo;
}) {
    const numberOfUnreadMessages =
        chatRoom.numberOfUnreadMessages > 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[100px] bg-red-500 p-0.5 px-1">
                <div className="flex text-center text-[12px] text-base font-thin not-italic leading-[normal] text-white ">
                    {chatRoom.numberOfUnreadMessages > 999
                        ? "999+"
                        : chatRoom.numberOfUnreadMessages.toString()}
                </div>
            </div>
        ) : null;

    console.log(chatRoom.title);
    return (
        <>
            {/* for spacing */}
            <div className="invisible flex border-4"></div>

            {/* chatrooms - image */}
            <div className="flex h-fit shrink-0 items-center gap-4 self-stretch overflow-hidden">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-600">
                        <Avatar
                            className={""}
                            size={"20"}
                            accountId={chatRoom.members[0].id}
                        />
                    </div>
                </div>

                {/* chatrooms - info */}
                <div className="flex h-16 flex-[1_0_0] items-center justify-between overflow-hidden py-2 pl-0 pr-3">
                    <div className="flex flex-col items-start">
                        <div className="text-sans flex h-4 flex-row text-ellipsis text-[17px] font-normal not-italic leading-6 text-white/80">
                            <span className="truncate text-ellipsis pr-2">
                                {children}
                            </span>
                            <span className="top-[2.5px] items-center space-x-1">
                                <LockIcon
                                    width={12}
                                    height="100%"
                                    className="text-gray-200"
                                />
                                <span className="text-sans overflow-hidden text-ellipsis text-[13px] font-normal not-italic leading-[19px] text-[color:var(--text-tertiary,rgba(255,255,255,0.11))]">
                                    {chatRoom.members.length}
                                </span>
                            </span>
                        </div>

                        <div className="text-sans h-8 max-w-[160px] overflow-hidden truncate text-[13px] font-normal not-italic text-white/30">
                            {chatRoom.latestMessage ?? ""}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 self-stretch">
                        <div className="text-sans overflow-hidden text-ellipsis text-right text-[13px] font-normal not-italic leading-[18px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                            12월 30일
                        </div>
                        {numberOfUnreadMessages}
                    </div>
                </div>
            </div>
        </>
    );
}
