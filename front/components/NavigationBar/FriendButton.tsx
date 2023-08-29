"use client";

import { forwardRef, useRef } from "react";
import { Icon } from "../ImageLibrary";
import { FriendModal } from "../FriendModal/FriendModal";

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

    return (
        <>
            <ModalComponent className="bg-transparent" ref={dialogRef}>
                <FriendModal />
            </ModalComponent>
            <Icon.Members
                onClick={showModal}
                className="h-12 w-12 rounded-lg p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary 2xl:h-14 2xl:w-14"
            />
        </>
    );
}
