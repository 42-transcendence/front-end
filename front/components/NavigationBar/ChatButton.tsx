"use client";

import React, { useRef, useState } from "react";
import { Icon } from "../ImageLibrary";
import { useAtomValue } from "jotai";
import { FriendRequestEntryAtom } from "@/atom/FriendAtom";
import { Dialog } from "@headlessui/react";
import ChatLayout from "../Chat/ChatLayout";
import { usePathname } from "next/navigation";

export function ChatButton() {
    const accountUUIDs = useAtomValue(FriendRequestEntryAtom);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const ChatIcon = isOpen ? Icon.ChatFilled : Icon.ChatOutlined;

    return (
        <>
            <Dialog
                open={isOpen}
                unmount={false}
                initialFocus={ref}
                onClose={() => setIsOpen(false)}
            >
                <Dialog.Panel className="absolute inset-0 top-16 flex items-center justify-center lg:inset-32">
                    <div className="relative flex h-full w-full justify-center 2xl:w-fit">
                        <ChatLayout />
                    </div>
                </Dialog.Panel>
            </Dialog>
            <div ref={ref} className="relative flex h-fit w-fit">
                <ChatIcon
                    onClick={() => setIsOpen(true)}
                    className="h-12 w-12 rounded-lg p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary 2xl:h-14 2xl:w-14"
                />
                {accountUUIDs.length !== 0 && (
                    <div className="absolute right-2 top-2 flex h-fit w-fit rounded-lg bg-red-500/90 p-1">
                        <div className="h-1 w-1 rounded-full bg-white"></div>
                    </div>
                )}
            </div>
        </>
    );
}
