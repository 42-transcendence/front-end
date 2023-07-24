/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React, { MouseEventHandler } from "react";
import { Avatar } from "../Avatar";
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
        <div className={`profile-item ${config.className}`}>
            <div className="selectable-area" onClick={onClick}>
                <div className="card disable-select">
                    <div className="avatar-frame">
                        <Avatar className="" size="w-11" />
                    </div>
                    <div className="info-frame">
                        <div className="user-id text-left">{config.name}</div>
                        {config.showStatusMessage && (
                            <div className="status-message">
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
