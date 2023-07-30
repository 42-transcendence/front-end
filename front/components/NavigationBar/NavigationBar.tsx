"use client";
/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import "./style.css";
import { Icon } from "../Icon/Icon";
import { Avatar } from "../Avatar";
import { ChatLayout } from "../Chat/ChatLayout";

function SocialButton() {
    const [showModal, setShowModal] = useState(false);
    const handleClick = () => setShowModal(!showModal);

    const mainNode = document.querySelector("main");

    if (mainNode === null) {
        return (
            <button type="button" onClick={handleClick}>
                <Icon className="" type="chat" size={20} />
            </button>
        );
    }

    return (
        <>
            <button type="button" onClick={handleClick}>
                <Icon className="" type="chat" size={20} />
            </button>
            {showModal &&
                createPortal(
                    <div className="absolute flex h-full w-full flex-col text-4xl font-extrabold">
                        <ChatLayout />
                    </div>,
                    mainNode,
                )}
        </>
    );
}

export function NavigationBar({}): React.ReactElement {
    // TODO: fetch account data.
    // TODO: change to tailwind css

    return (
        <div className="navigation-bar nav-margin">
            <div className="nav-bar-background">
                <Link href="/main">
                    <Icon className="" type="doubleSharp" size={20} />
                </Link>
                <div className="flex flex-row justify-between">
                    <SocialButton />
                    <Icon className="" type="chat" size={20} />
                    <div className="profile-photo right-side-icons">
                        <Avatar size={"w-12"} accountId={1} className={""} />
                    </div>
                </div>
            </div>
        </div>
    );
}
