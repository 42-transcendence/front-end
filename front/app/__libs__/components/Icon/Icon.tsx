/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import Image from "next/image";

export function Icon({
    className,
    type,
    size,
}: {
    className: string;
    type: "check" | "double-sharp" | "edit" | "star-filled" | "sidebar";
    size: number;
}): React.ReactElement {
    return (
        <>
            <Image
                className={className}
                src={`/${type}.svg`}
                alt={`icon is ${type}`}
                width={size}
                height={size}
            />
        </>
    );
}
