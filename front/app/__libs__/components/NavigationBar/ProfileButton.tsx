"use client";

import { Avatar } from "@components/Avatar";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { useRouter } from "next/navigation";
import { usePrivateProfile } from "@hooks/useProfile";

export function ProfileButton() {
    const currentAccountUUID = useCurrentAccountUUID();
    const router = useRouter();
    const profile = usePrivateProfile();

    const gotoMyProfile = () => {
        if (profile !== undefined) {
            router.push(`/profile/${profile.nickName}/${profile.nickTag}`);
        }
    };

    return (
        <button
            className="flex h-12 w-12 items-center justify-center rounded-lg outline-none hover:bg-primary/30 focus-visible:outline-primary/70 active:bg-secondary/70"
            onClick={() => gotoMyProfile()}
        >
            <Avatar
                accountUUID={currentAccountUUID}
                className="relative h-8 w-8 bg-white/30"
                privileged={true}
            />
        </button>
    );
}
