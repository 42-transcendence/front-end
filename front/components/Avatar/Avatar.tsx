/* eslint-disable jsx-a11y/alt-text */
/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { Status } from "../Status";
import Image from "next/image";

type AvatarInfo = {
    profileImage: string;
    userStatus:
        | "online"
        | "invisible"
        | "offline"
        | "idle"
        | "matching"
        | "do-not-disturb"
        | "in-game";
};

const dummy: AvatarInfo[] = [
    {
        profileImage: "/hdoo.png",
        userStatus: "online",
    },
    {
        profileImage: "/chanhpar.png",
        userStatus: "online",
    },
    {
        profileImage: "/iyun.png",
        userStatus: "online",
    },
    {
        profileImage: "/jkong.png",
        userStatus: "online",
    },
    {
        profileImage: "/jisookim.png",
        userStatus: "online",
    },
];

export function Avatar({
    className,
    size,
    accountId,
}: {
    className: string;
    size: string;
    accountId: number;
}): React.ReactElement {
    //TODO: fetch Avatar datas
    // \-  get user profile and status from accountid

    const userInfo: AvatarInfo = dummy[accountId - 1];

    return (
        <div
            className={`relative flex aspect-square ${size} flex-shrink-0 items-start gap-2.5 rounded-full bg-[#ffffff40] ${className}`}
        >
            <Image
                className="relative flex-1 flex-grow self-stretch rounded-full"
                src={userInfo.profileImage}
                alt="Avatar"
                fill={true}
            />
            <div
                className={`absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full`}
            >
                <Status type={userInfo.userStatus} />
            </div>
        </div>
    );
}
