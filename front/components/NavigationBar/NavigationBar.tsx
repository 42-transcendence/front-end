"use client";

import React from "react";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { SocialButton } from "./SocialButton";
import { DoubleSharp } from "@/components/ImageLibrary";
import type { AccountProfilePrivatePayload } from "@/library/payload/profile-payloads";
import { fetcher, useSWR } from "@/hooks/fetcher";
import { FriendButton } from "./FriendButton";

export function NavigationBar() {
    const { data } = useSWR(
        "/profile/private",
        fetcher<AccountProfilePrivatePayload>,
    );

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
                <SocialButton />
                <FriendButton />
                {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                <Avatar
                    accountUUID={data?.uuid ?? ""}
                    className="relative h-9 w-9 bg-white/30"
                    privileged={true}
                />
            </div>
        </div>
    );
}
//
