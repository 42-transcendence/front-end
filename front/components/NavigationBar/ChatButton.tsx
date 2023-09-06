"use client";

import { AnimatePresence, motion } from "framer-motion";
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

    const constraintsRef = useRef(null);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <Dialog
                        as={motion.div}
                        key="ChatModal"
                        open={isOpen}
                        initialFocus={ref}
                        onClose={() => setIsOpen(false)}
                    >
                        <motion.div
                            ref={constraintsRef}
                            className="fixed inset-0"
                            aria-hidden="true"
                        />

                        <Dialog.Panel
                            drag
                            dragConstraints={constraintsRef}
                            as={motion.div}
                            className="absolute inset-4 inset-y-8 mx-auto max-w-7xl lg:inset-32"
                        >
                            <ChatLayout>
                                <ChatLeftSideBar />
                                <ChatMainPage>
                                    <Dialog.Title className="relative w-full">
                                        <ChatHeader />
                                    </Dialog.Title>
                                    <Dialog.Description className="relative h-full w-full overflow-auto">
                                        <ChatDialog
                                            innerFrame={"2xl:rounded-lg"}
                                            outerFrame={"w-full"}
                                        />
                                    </Dialog.Description>
                                </ChatMainPage>
                                <ChatRightSideBar />
                            </ChatLayout>
                        </Dialog.Panel>
                    </Dialog>
                )}
            </AnimatePresence>

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
