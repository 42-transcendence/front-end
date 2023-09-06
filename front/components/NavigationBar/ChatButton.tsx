"use client";

import React, { useRef, useState } from "react";
import { Icon } from "../ImageLibrary";
import { Dialog } from "@headlessui/react";
import ChatLayout from "../Chat/ChatLayout";
import { useChatRoomTotalUnreadCount } from "@/hooks/useChatRoom";
import { NotificationBadge } from "./NotificationBadge";

export function ChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    const totalUnreadMessages = useChatRoomTotalUnreadCount();

    const iconClassName = [
        "h-12 w-12 rounded-lg p-2 shadow-white",
        "drop-shadow-[0_0_0.1rem_#ffffff30]",
        "hover:bg-primary/30 hover:text-white/80",
        "active:bg-secondary 2xl:h-14 2xl:w-14",
    ].join(" ");

    const ChatIcon = isOpen ? (
        <Icon.ChatFilled className={iconClassName} />
    ) : (
        <Icon.ChatOutlined className={iconClassName} />
    );

    return (
        <>
            <Dialog
                open={isOpen}
                initialFocus={ref}
                onClose={() => setIsOpen(false)}
            >
                <Dialog.Panel className="absolute inset-0 top-16 flex items-center justify-center lg:inset-x-1/2 lg:inset-y-32">
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
                {ChatIcon}
                {totalUnreadMessages !== undefined &&
                    totalUnreadMessages !== 0 && <NotificationBadge />}
            </button>
        </>
    );
}
