/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { MouseEventHandler } from "react";
import { Avatar } from "../Avatar";

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
            className={`relative flex h-fit w-full shrink-0 flex-col items-start ${className} `}
        >
            <div
                className="group relative flex flex-row items-center space-x-4 self-stretch rounded p-4 hover:bg-primary/30"
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
                    <div className="relative w-full overflow-hidden whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50 ">
                        {
                            children
                                ? children
                                : accountUUID.substring(1, 4) /* nickname*/
                        }
                    </div>
                    {selected && <div className="bg-green-500">glgl</div>}
                </div>
            </div>
        </li>
    );
}
