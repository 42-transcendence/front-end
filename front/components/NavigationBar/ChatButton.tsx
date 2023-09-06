"use client";

import React, { useRef, useState } from "react";
import { Icon } from "../ImageLibrary";
import { useAtomValue } from "jotai";
import { FriendRequestEntryAtom } from "@/atom/FriendAtom";
import { Dialog } from "@headlessui/react";
import ChatLayout from "../Chat/ChatLayout";
import { useChatRoomTotalUnreadCount } from "@/hooks/useChatRoom";

export function ChatButton() {
    //TODO: check by  unread message not FriendRequestEntryAtom
    const accountUUIDs = useAtomValue(FriendRequestEntryAtom);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    const totalUnReadMessage = useChatRoomTotalUnreadCount();

    const ChatIcon = isOpen ? Icon.ChatFilled : Icon.ChatOutlined;

    return (
        <>
            <Dialog
                open={isOpen}
                initialFocus={ref}
                onClose={() => setIsOpen(false)}
            >
                <Dialog.Panel className="absolute inset-0 top-16 flex items-center justify-center lg:inset-32 lg:bottom-16">
                    <div className="relative flex h-full w-full justify-center 2xl:w-fit">
                        <ChatLayout />
                    </div>
                </Dialog.Panel>
            </Dialog>
            <button
                onClick={() => setIsOpen(true)}
                ref={ref}
                className="relative flex h-fit w-fit rounded outline-none focus-visible:outline-primary/70"
            >
                <ChatIcon className="h-12 w-12 rounded-lg p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 active:bg-secondary 2xl:h-14 2xl:w-14" />
                {totalUnReadMessage !== 0 && (
                    <div className="absolute right-2 top-2 flex h-fit w-fit rounded-lg bg-red-500/90 p-1">
                        <div className="h-1 w-1 rounded-full bg-white"></div>
                    </div>
                )}
            </button>
        </>
    );
}
