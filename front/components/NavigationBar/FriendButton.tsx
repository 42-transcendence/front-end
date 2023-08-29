"use client";

import { forwardRef, useRef } from "react";
import { Icon } from "../ImageLibrary";

const ModalComponent = forwardRef(function ModalComponent(
    { children }: React.PropsWithChildren,
    ref: React.ForwardedRef<HTMLDialogElement>,
) {
    return <dialog ref={ref}>{children}</dialog>;
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
            <ModalComponent ref={dialogRef}>
                {/* modal로 띄우고 싶은 걸 넣으세요 */}
            </ModalComponent>
            <Icon.Members
                onClick={showModal}
                className="h-12 w-12 rounded-lg p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary 2xl:h-14 2xl:w-14"
            />
        </>
    );
}
