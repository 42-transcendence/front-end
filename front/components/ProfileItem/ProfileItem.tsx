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
} from "../ContextMenu";

type ProfileItemViewConfig = {
    showStatusMessage: boolean;
    className?: any;
};

export type ProfileItemConfig = ProfileItemInternlConfig &
    ProfileItemViewConfig;

export function ProfileItem({
    config,
    selected,
    children,
    onClick,
}: {
    config: ProfileItemConfig;
    selected: boolean;
    children?: React.ReactNode | undefined;
    onClick: MouseEventHandler;
}) {
    return (
        <div
            className={`relative flex w-full flex-col items-start rounded-[28px] ${config.className} gap-4 py-4 hover:bg-primary/30`}
        >
            <div
                className="group relative flex w-full flex-row items-center space-x-4 self-stretch px-4"
                onClick={onClick}
            >
                <div className="disable-select relative flex items-center gap-2 space-x-4 rounded-xl">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            className=""
                            accountId={config.id}
                            size="w-[45px]"
                        />
                    </div>
                    <div className="relative, flex w-fit flex-col items-start gap-1">
                        <div className="text-bold relative w-fit whitespace-nowrap font-sans text-base leading-none tracking-normal text-gray-50">
                            {children ? children : config.name}
                        </div>
                        {config.showStatusMessage && (
                            <div className="text-normal text-xs text-gray-300">
                                {config.statusMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selected && <ContextMenu_Social profile={config} />}
        </div>
    );
}
