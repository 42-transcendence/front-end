/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { MouseEventHandler } from "react";
import { Avatar } from "../Avatar";
import { ProfileItemConfig } from "./ProfileItem";

export function ProfileItemSelectable({
    className,
    selected,
    accountUUID,
    children,
    onClick,
}: {
    className?: string | undefined;
    accountUUID: string;
    selected: boolean;
    children?: React.ReactNode | undefined;
    onClick: MouseEventHandler;
}) {
    return (
        <div
            className={`relative flex h-fit w-full shrink-0 flex-col items-start ${className} `}
        >
            <div
                className="group relative flex w-full flex-row items-center space-x-4 self-stretch rounded p-4 hover:bg-primary/30"
                onClick={onClick}
            >
                <div className="relative flex select-none items-center gap-2 space-x-4 rounded">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            className=""
                            accountUUID={accountUUID}
                            size="w-[45px]"
                        />
                    </div>
                    <div className="relative flex w-fit flex-col items-start gap-1">
                        <div className="relative w-fit whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                            {children ? children : accountUUID.substring(1, 4) /* nickname*/ }
                        </div>
                    </div>
                    {selected && <div className="bg-green-500">
                        glgl
                        </div>}
                </div>
            </div>
        </div>
    );
}
