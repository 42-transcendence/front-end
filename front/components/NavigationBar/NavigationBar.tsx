"use client";
/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { useEffect, useState } from "react";
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
                    className="rounded-sm text-primary drop-shadow-[0_0_0.3rem_#ffffff70] focus:bg-controlsSelected "
                    width={42}
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
                    className="rounded-sm text-primary drop-shadow-[0_0_0.3rem_#ffffff70] focus:bg-controlsSelected "
                    width={42}
                    height="100%"
                />
            </button>
            {mainNode !== null &&
                showModal &&
                createPortal(
                    <div className="absolute inset-0 flex h-full w-full flex-col text-4xl font-extrabold">
                        <ChatLayout />
                    </div>,
                    mainNode,
                )}
        </>
    );
}

export function NavigationBar() {
    // TODO: fetch account data.
    // TODO: change to tailwind css

    return (
        <>
            <div className="relative flex h-16 w-full flex-row items-center justify-between bg-black/80 px-5 py-2.5 backdrop-blur-[20px] backdrop-brightness-100">
                <Link className="relative" href="/main">
                    <DoubleSharp
                        className="text-white drop-shadow-[0_0_0.3rem_#ffffff70]"
                        width={32}
                        height="100%"
                    />
                </Link>
                <div className="relative flex flex-row items-center justify-between gap-4 ">
                    <SocialButton />
                    {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                    <Avatar
                        size={"w-10 h-10"}
                        accountId={1}
                        className="relative bg-white/30"
                    />
                </div>
            </div>
        </>
    );
}
//
