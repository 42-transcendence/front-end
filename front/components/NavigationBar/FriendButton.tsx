"use client";

import { forwardRef, useRef } from "react";
import { Icon } from "../ImageLibrary";
import { FriendModal } from "../FriendModal/FriendModal";
import { useAtomValue } from "jotai";
import { FriendRequestEntryAtom } from "@/atom/FriendAtom";

const ModalComponent = forwardRef(function ModalComponent(
    { children, className }: { children: React.ReactNode; className: string },
    ref: React.ForwardedRef<HTMLDialogElement>,
) {
    return (
        <dialog className={className} ref={ref}>
            {children}
        </dialog>
    );
});

export function FriendButton() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const showModal = () => {
        if (dialogRef.current === null) {
            throw new Error();
        }
        dialogRef.current.showModal();
    };
    // useOutsideClick(dialogRef, () => dialogRef.current?.close(), true);
    const accountUUIDs = useAtomValue(FriendRequestEntryAtom);

    return (
        <>
            <ModalComponent className="bg-transparent" ref={dialogRef}>
                <FriendModal />
            </ModalComponent>
            <div className="relative flex h-fit w-fit">
                <Icon.Members
                    onClick={showModal}
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
