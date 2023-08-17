/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { MouseEventHandler } from "react";
import { Avatar } from "../Avatar";
import { IconCheck } from "../ImageLibrary";

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
        <li
            className={`group/profile relative flex h-fit w-full shrink-0 flex-col items-start ${className} `}
        >
            <div
                className="relative flex flex-row items-center space-x-4 self-stretch rounded p-4 hover:bg-primary/30"
                onClick={onClick}
            >
                <div className="relative flex w-full select-none items-center gap-4 rounded">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            className=""
                            accountUUID={accountUUID}
                            size="w-[32px]"
                        />
                    </div>
                    <div className="overflow-hidden">
                        <div className="relative w-full overflow-hidden whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50 transition-all ease-linear group-hover/profile:-translate-x-[150%] group-hover/profile:overflow-visible group-hover/profile:duration-[3000ms]">
                            {
                                children
                                    ? children
                                    : accountUUID.substring(1, 4) /* nickname*/
                            }
                        </div>
                    </div>
                    {selected ? (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/80 outline-gray-300/60">
                            <IconCheck className="p-0.5 text-white" />
                        </div>
                    ) : (
                        <div className="h-6 w-6 shrink-0 rounded-full outline outline-1 outline-gray-300/60"></div>
                    )}
                </div>
            </div>
        </li>
    );
}
