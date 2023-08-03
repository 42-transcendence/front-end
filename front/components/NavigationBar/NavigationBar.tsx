"use client";
/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Avatar } from "../Avatar";
import { ChatLayout } from "../Chat/ChatLayout";
import DoubleSharp from "/public/doubleSharp.svg";
import Chat from "/public/chat.svg";
import Chatfilled from "/public/chatfilled.svg";

function SocialButton() {
    const [showModal, setShowModal] = useState(false);
    const handleClick = () => setShowModal(!showModal);

    const mainNode = document.querySelector("main");

    if (mainNode === null) {
        return (
            <button type="button" onClick={handleClick}>
                <Chat
                    className="drop-shadow-[0_0_3rem_#ffffff30] dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                    width={32}
                    height="100%"
                />
            </button>
        );
    }

    const ChatIcon = showModal ? Chatfilled : Chat;

    return (
        <>
            <button type="button" className="" onClick={handleClick}>
                <ChatIcon
                    className="text-black drop-shadow-[0_0_0.3rem_#00000070] focus:bg-controlsSelected dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                    width={42}
                    height="100%"
                />
            </button>
            {showModal &&
                createPortal(
                    <div className="absolute inset-0 flex h-full w-full flex-col text-4xl font-extrabold">
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
        <>
            <div className="relative flex h-16 w-full flex-row items-center justify-between bg-darker px-5 py-2.5 backdrop-blur-[20px] backdrop-brightness-100 dark:bg-priVar/30">
                <Link className="relative" href="/main">
                    <DoubleSharp
                        className="text-black drop-shadow-[0_0_0.3rem_#00000070] dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                        width={32}
                        height="100%"
                    />
                </Link>
                <div className="relative flex flex-row items-center justify-between gap-4 ">
                    <SocialButton />
                    {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                    <Avatar
                        size={"w-10"}
                        accountId={1}
                        className={"bg-white/30 dark:bg-black/30"}
                    />
                </div>
            </div>
        </>
    );
}
//
