/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React, { MouseEventHandler } from "react";
import { Avatar } from "../Avatar";
import "./style.css";
import { TextField } from "../TextField";
import {
    ProfileItemConfig as ProfileItemInternlConfig,
    ContextMenu_Friend,
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
    onClick,
}: {
    config: ProfileItemConfig;
    selected: boolean;
    onClick: MouseEventHandler;
}): React.ReactElement {
    return (
        <div
            className={`relative flex w-[260px] flex-col items-start rounded-[28px] py-4 ${config.className} transition-all ease-in-out hover:bg-primary active:bg-priVar focus:outline-none focus:ring focus:ring-violet-300`}
        >
            <div
                className="relative flex w-full flex-row items-center space-x-4 self-stretch px-4"
                onClick={onClick}
            >
                <div className="disable-select relative flex items-center gap-2 space-x-4 rounded-xl">
                    <div className="relative flex items-center justify-center">
                        <Avatar className="" size="w-[45px]" />
                    </div>
                    <div className="relative, flex w-fit flex-col items-start gap-1">
                        <div className="text-bold relative w-fit whitespace-nowrap font-sans text-base leading-none tracking-normal text-gray-50">
                            {config.name}
                        </div>
                        {config.showStatusMessage && (
                            <div className="text-normal text-xs text-gray-300">
                                {config.statusMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selected && <ContextMenu_Friend profile={config} />}
        </div>
    );
}

ProfileItem.propTypes = {
    showStatusMessage: PropTypes.bool,
    showContextMenu: PropTypes.bool,
    type: PropTypes.oneOf(["full", "slim"]),
    state: PropTypes.oneOf(["hover", "idle"]),
    text: PropTypes.string,
};
