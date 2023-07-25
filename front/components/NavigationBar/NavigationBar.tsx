/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
import "./style.css";
import { Icon } from "../Icon/Icon";
import { Avatar } from "../Avatar";

export function NavigationBar({}): React.ReactElement {
    // TODO: fetch account data.

    return (
        <div className="navigation-bar nav-margin">
            <div className={`nav-bar-background`}>
                <Icon className="" type="doubleSharp" size={20} />
                <Avatar className="" size={""} />
            </div>
        </div>
    );
}
