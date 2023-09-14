"use client";

import { Icon } from "../ImageLibrary";
import { FriendModal } from "../FriendModal/FriendModal";
import { useAtom, useAtomValue } from "jotai";
import { FriendModalIsOpen, FriendRequestListAtom } from "@atoms/FriendAtom";
import { Dialog } from "@headlessui/react";
import { NotificationBadge } from "./NotificationBadge";

export function FriendButton() {
    const accountUUIDs = useAtomValue(FriendRequestListAtom);
    const [isOpen, setIsOpen] = useAtom(FriendModalIsOpen);

    const iconClassName = [
        "h-12 w-12 rounded-lg p-3 shadow-white",
        "drop-shadow-[0_0_0.1rem_#ffffff30]",
        "hover:bg-primary/30 hover:text-white/80",
        "active:bg-secondary 2xl:h-14 2xl:w-14",
    ].join(" ");

    const MemberIcon = isOpen ? (
        <Icon.MembersFilled className={iconClassName} />
    ) : (
        <Icon.MembersOutLined className={iconClassName} />
    );

    return (
        <>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <div className="absolute right-4 top-20 flex items-center justify-center 2xl:top-[5.5rem]">
                    <Dialog.Panel>
                        <FriendModal />
                    </Dialog.Panel>
                </div>
            </Dialog>
            <button
                onClick={() => setIsOpen(true)}
                className="relative flex h-fit w-fit rounded outline-none focus-visible:outline-primary/70"
            >
                {MemberIcon}
                <NotificationBadge totalUnreadCount={accountUUIDs.length} />
            </button>
        </>
    );
}
