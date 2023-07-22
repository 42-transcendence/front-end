/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import clsx from "clsx";
import Image from "next/image";

export function Status({
    type,
    size,
}: {
    type:
        | "online"
        | "invisible"
        | "offline"
        | "idle"
        | "matching"
        | "do-not-disturb"
        | "in-game";
    size: number;
}): React.ReactElement {
    clsx(type);
    return (
        <>
            <Image
                src={`/status/${type}.svg`}
                alt={`status is ${type}`}
                width={size}
                height={size}
            />
        </>
    );
}
