"use client";

import React from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { DoubleSharp } from "@/components/ImageLibrary";
import { FriendButton } from "./FriendButton";
import { useCurrentAccountUUID } from "@/hooks/useCurrent";
import { ChatButton } from "./ChatButton";

export function NavigationBar() {
    const currentAccountUUID = useCurrentAccountUUID();

    return (
        <div className="relative flex h-fit w-full flex-row items-center justify-between bg-primary/30 p-2 backdrop-blur-[20px] backdrop-brightness-100">
            <Link className="relative" href="/">
                <DoubleSharp
                    className="w-12 p-2 text-white drop-shadow-[0_0_0.3rem_#ffffff70]"
                    width="100%"
                    height="100%"
                />
            </Link>
            <div className="relative flex flex-row items-center justify-between gap-4">
                <ChatButton />
                <FriendButton />
                {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                <Avatar
                    accountUUID={currentAccountUUID}
                    className="relative h-9 w-9 bg-white/30"
                    privileged={true}
                />
            </div>
        </div>
    );
}
//
