"use client";

import React from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { DoubleSharp } from "@/components/ImageLibrary";
import { FriendButton } from "./FriendButton";
import { useCurrentAccountUUID } from "@/hooks/useCurrent";
import { ChatButton } from "./ChatButton";
import { useRouter } from "next/navigation";
import { usePrivateProfile } from "@/hooks/useProfile";

export function NavigationBar() {
    return (
        <div className="relative flex h-fit w-full flex-row items-center justify-between bg-primary/30 p-2 backdrop-blur-[20px] backdrop-brightness-100">
            <Link tabIndex={-1} className="relative" href="/">
                <DoubleSharp
                    tabIndex={0}
                    className="w-12 rounded-lg p-2 text-white outline-none transition-all hover:drop-shadow-[0_0_0.3rem_#ffffff90] focus-visible:outline-primary/70"
                    width={48}
                    height={48}
                />
            </Link>
            <div className="relative flex flex-row items-center justify-between gap-4">
                <ChatButton />
                <FriendButton />
                {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                <ProfileButton />
            </div>
        </div>
    );
}

function ProfileButton() {
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
