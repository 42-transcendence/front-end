/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import Image from "next/image";

export type StatusType =
    | "online"
    | "invisible"
    | "offline"
    | "idle"
    | "matching"
    | "do-not-disturb"
    | "in-game";

export function Status({ type }: { type: StatusType }): React.ReactElement {
    return (
        <>
            <Image
                src={`/status/${type}.svg`}
                alt={`status is ${type}`}
                fill={true}
            />
        </>
    );
}
