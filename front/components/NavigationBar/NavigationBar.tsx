/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React from "react";
// import { DoubleSharp } from "../../icons/DoubleSharp";
import "./style.css";
import { Icon } from "../Icon/Icon";
import { Avatar } from "../Avatar";

export function NavigationBar({
    navBarBackgroundClassName,
}: Props): React.ReactElement {
    return (
        <div className="navigation-bar nav-margin">
            <div className={`nav-bar-background ${navBarBackgroundClassName}`}>
                {/* <DoubleSharp className="double-sharp" /> */}
                <div className="right-side-icons">
                    <img
                        className="profile-photo"
                        alt="Profile photo"
                        src="https://anima-uploads.s3.amazonaws.com/projects/64b14af317e3b2a0728b3aa2/releases/64b14bc1c6eacef1ee7ae8ab/img/profilephoto@2x.png"
                    />
                </div>
            </div>
        </div>
    );
}


export function NavigationBar({ }): React.ReactElement {
    // TODO: fetch account data.

    return (
        <div className="navigation-bar nav-margin">
            <div className={`nav-bar-background`}>
                <Icon className="" type="doubleSharp" size={20} />
                <div className="profile-photo right-side-icons" >
                    <Avatar size={""} />
                </div>
           </div>
        </div>
    );
}
