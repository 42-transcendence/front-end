"use client";
import React, { ReactNode } from "react";
import { IconLock, IconPerson } from "@/components/ImageLibrary";
import { ChatRoomInfo } from "./ChatRoomList";
import { Avatar } from "../Avatar";

export default function ChatRoomBlock({
    children,
    chatRoom,
}: {
    children: ReactNode;
    chatRoom: ChatRoomInfo;
}) {
    const numberOfUnreadMessages =
        chatRoom.numberOfUnreadMessages > 0 ? (
            <div className="flex min-w-[22px] flex-col items-center justify-center rounded-md bg-red-500 p-1">
                <span className="flex text-center font-sans font-medium not-italic text-white ">
                    {chatRoom.numberOfUnreadMessages > 999
                        ? "999+"
                        : chatRoom.numberOfUnreadMessages.toString()}
                </span>
            </div>
        ) : null;

    return (
        <div className="w-full rounded-lg px-2 hover:bg-primary/30 active:bg-secondary/80">
            {/* chatrooms - image */}
            <div className="flex h-fit shrink-0 items-center gap-4 self-stretch overflow-hidden">
                <div className="flex items-center justify-center gap-2.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-600">
                        {/* TODO: change to member preview (limit 4)*/}
                        <Avatar
                            className={"relative h-10 w-10"}
                            accountUUID={chatRoom.members[0].uuid}
                        />
                    </div>
                </div>

                {/* chatrooms - info */}
                <div className="flex h-fit w-full justify-between gap-4 py-2 pl-0">
                    <div className="h-16 p-0">
                        <div className="flex h-8 flex-row items-center gap-2">
                            <span className="relative line-clamp-1 min-w-min text-ellipsis font-sans text-base font-bold leading-none tracking-normal text-white/90">
                                {children}
                            </span>
                            <span className="flex h-fit w-fit shrink-0 flex-row gap-1">
                                <IconLock
                                    width={12}
                                    height={12}
                                    className="text-yellow-200/70"
                                />
                            </span>
                        </div>

                        <div className="line-clamp-2 h-fit  text-ellipsis font-sans text-xs font-normal text-gray-200">
                            {chatRoom.latestMessage ?? ""}
                        </div>
                    </div>

                    <div className="relative flex flex-col items-end gap-4 text-xs leading-3">
                        <div className="flex shrink-0 flex-row gap-1">
                            <IconPerson
                                width={12}
                                height={12}
                                className="text-gray-200/70"
                            />
                            <span className=" text-[12px] leading-3 text-gray-50/50">
                                {chatRoom.members.length}
                            </span>
                        </div>
                        {numberOfUnreadMessages}
                    </div>
                </div>
            </div>
        </div>
    );
}
