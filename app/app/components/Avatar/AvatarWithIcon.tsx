/* eslint-disable jsx-a11y/alt-text */
/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";
import { Status } from "../Status";
import Image from "next/image";

type userExample = {
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

const temp: userExample = {
    profileImage: "/hdoo.png",
    userStatus: "online",
};

export const Avatar = ({
    className,
}: {
    className: string;
}): React.ReactElement => {
    return (
        <div className="relative flex w-16">
            <Image
                className={`${className}`}
                src={temp.profileImage}
                alt="Avatar"
                fill
            />
            <Status className="relative w-4" type={temp.userStatus} />
        </div>
    );
};
