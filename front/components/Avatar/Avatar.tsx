/* eslint-disable jsx-a11y/alt-text */
/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import { Status } from "../Status";
import Image from "next/image";

export type UserStatus =
    | "online"
    | "invisible"
    | "offline"
    | "idle"
    | "matching"
    | "do-not-disturb"
    | "in-game";

type AvatarInfo = {
    profileImage: string;
    userStatus: UserStatus;
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
    accountUUID,
}: {
    className: string;
    accountUUID?: string;
}): React.ReactElement {
    //TODO: fetch Avatar datas
    // \-  get user profile and status from accountid

    const avatarKey = "jisookim"; //FIXME: temporary
    const status = "online"; //FIXME: temporary

    return (
        <div
            className={`${className} flex aspect-square items-start gap-2.5 rounded-full`}
        >
            <Image
                className="relative rounded-full"
                src={`/${avatarKey}.png`}
                alt="Avatar"
                fill={true}
            />
            <div
                className={`absolute bottom-0 right-0 aspect-square h-1/3 w-1/3 rounded-full`}
            >
                <Status type={status} />
            </div>
        </div>
    );
}
