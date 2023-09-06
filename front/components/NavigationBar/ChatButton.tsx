"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@/components/ImageLibrary";
import { Dialog } from "@headlessui/react";
import { useChatRoomTotalUnreadCount } from "@/hooks/useChatRoom";
import { NotificationBadge } from "./NotificationBadge";
import ChatLayout from "@/components/Chat/ChatLayout";
import ChatLeftSideBar from "@/components/Chat/ChatLeftSideBar";
import ChatMainPage from "@/components/Chat/ChatMainPage";
import ChatRightSideBar from "@/components/Chat/ChatRightSideBar";
import { ChatHeader } from "@/components/Chat/ChatHeader";
import { ChatDialog } from "@/components/Chat/ChatDialog";

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
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <Dialog.Panel className="absolute inset-0 top-12 mx-auto max-w-7xl lg:inset-32">
                        <ChatLayout>
                            <ChatLeftSideBar />
                            <ChatMainPage>
                                <ChatHeader />
                                <ChatDialog
                                    innerFrame={"2xl:rounded-lg"}
                                    outerFrame={"w-full"}
                                />
                            </ChatMainPage>
                            <ChatRightSideBar />
                        </ChatLayout>
                    </Dialog.Panel>
                </div>
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
