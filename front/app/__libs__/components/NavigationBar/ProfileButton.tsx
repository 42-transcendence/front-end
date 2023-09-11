"use client";

import { Avatar } from "@components/Avatar";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
// import { useRouter } from "next/navigation";
// import { usePrivateProfile } from "@hooks/useProfile";
import { Dialog } from "@headlessui/react";
import { ProfileModalIsOpen } from "@atoms/ProfileAtom";
import { useAtom } from "jotai";
import { ProfileModal } from "./ProfileModal";

export function ProfileButton() {
    // TODO: remove comments
    const currentAccountUUID = useCurrentAccountUUID();
    // const router = useRouter();
    // const profile = usePrivateProfile();
    const [isOpen, setIsOpen] = useAtom(ProfileModalIsOpen);

    // const gotoMyProfile = () => {
    //     if (profile !== undefined) {
    //         router.push(`/profile/${profile.nickName}/${profile.nickTag}`);
    //     }
    // };

    return (
        <>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <div className="absolute right-4 top-20 flex items-center justify-center 2xl:top-[5.5rem]">
                    <Dialog.Panel>
                        <ProfileModal />
                    </Dialog.Panel>
                </div>
            </Dialog>
            <button
                className="flex h-12 w-12 items-center justify-center rounded-lg outline-none hover:bg-primary/30 focus-visible:outline-primary/70 active:bg-secondary/70"
                onClick={() => setIsOpen(true)}
            >
                <Avatar
                    accountUUID={currentAccountUUID}
                    className="relative h-8 w-8 bg-white/30"
                    privileged={true}
                />
            </button>
        </>
    );
}
