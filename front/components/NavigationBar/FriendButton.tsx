"use client";

import { useState } from "react";
import { Icon } from "../ImageLibrary";
import { FriendModal } from "../FriendModal/FriendModal";
import { useAtomValue } from "jotai";
import { FriendRequestEntryAtom } from "@/atom/FriendAtom";
import { Dialog } from "@headlessui/react";

export function FriendButton() {
    const accountUUIDs = useAtomValue(FriendRequestEntryAtom);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <div className="absolute right-4 top-20 flex items-center justify-center 2xl:top-[5.5rem]">
                    <Dialog.Panel>
                        <FriendModal />
                    </Dialog.Panel>
                </div>
            </Dialog>
            <div className="relative flex h-fit w-fit">
                <Icon.Members
                    onClick={() => setIsOpen(true)}
                    className="h-12 w-12 rounded-lg p-3 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary 2xl:h-14 2xl:w-14"
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
