/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { MouseEventHandler } from "react";
import { Avatar } from "../Avatar";
import {
    ProfileItemConfig as ProfileItemInternlConfig,
    ContextMenu_Friend,
    ContextMenu_Social,
    ContextMenu_MyProfile,
} from "../ContextMenu";

export type ProfileItemConfig = ProfileItemInternlConfig;

export function ProfileItem({
    className,
    info,
    selected,
    children,
    type,
    onClick,
}: {
    className?: string | undefined;
    info: ProfileItemConfig;
    selected: boolean;
    children?: React.ReactNode | undefined;
    onClick?: MouseEventHandler | undefined;
    type?: "social" | "friend" | "myprofile" | undefined;
}) {
    const contextMenuType = () => {
        switch (type) {
            case "social":
                return <ContextMenu_Social info={info} />;
            case "friend":
                return <ContextMenu_Friend info={info} />;
            case "myprofile":
                return <ContextMenu_MyProfile info={info} />;
            default:
                return <></>;
        }
    };
    return (
        <div
            className={`relative flex h-fit w-full shrink-0 flex-col items-start ${className} `}
        >
            <div
                className="group relative flex w-full flex-row items-center space-x-4 self-stretch rounded p-4 hover:bg-primary/30"
                onClick={onClick}
            >
                <div className="disable-select relative flex items-center gap-2 space-x-4 rounded">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            className=""
                            //TODO: add uuid here
                            accountUUID={info.uuid}
                            size="w-[45px]"
                        />
                    </div>
                    <div className="relative flex w-fit flex-col items-start gap-1">
                        <div className="relative w-fit whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                            {children !== undefined ? children : info.name}
                        </div>
                        {info.statusMessage !== undefined && (
                            <div className="text-normal text-xs text-gray-300">
                                {info.statusMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selected && contextMenuType()}
        </div>
    );
}
