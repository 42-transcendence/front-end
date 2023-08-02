"use client";
/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import "./style.css";
import { Icon } from "../Icon/Icon";
import { Avatar } from "../Avatar";
import { ChatLayout } from "../Chat/ChatLayout";
import Image from "next/image";
import DoubleSharp from "/public/doubleSharp.svg";
import Social from "/public/social.svg";

function SocialButton() {
    const [showModal, setShowModal] = useState(false);
    const handleClick = () => setShowModal(!showModal);

    const mainNode = document.querySelector("main");

    return (
        <>
            <button type="button" onClick={handleClick}>
                <Social
                    className="text-white drop-shadow-[0_0_0.3rem_#00000030] dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                    width={42}
                    height="100%"
                />
            </button>
            {mainNode !== null &&
                showModal &&
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
        <>
            <div className="relative flex h-16 w-full flex-row items-center justify-between bg-neutral-900/30 px-5 py-2.5 backdrop-blur-[20px] backdrop-brightness-100">
                <Link className="relative" href="/main">
                    {/* <Icon
                        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                        type="doubleSharp"
                        size={20}
                    /> */}

                    <DoubleSharp
                        className="text-black drop-shadow-[0_0_0.3rem_#00000030] dark:text-white dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                        width={32}
                        height="100%"
                    />
                </Link>
                <div className="relative flex flex-row items-center justify-between gap-4 ">
                    <SocialButton />
                    {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                    <Avatar
                        size={"w-12"}
                        accountId={1}
                        className={"fill-ultraDark"}
                    />
                </div>
            </div>
        </>
    );
}
//
