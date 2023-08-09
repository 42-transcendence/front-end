"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ChatOutlined, ChatFilled } from "@/components/ImageLibrary";
import ChatLayout from "../Chat/ChatLayout";

export function SocialButton() {
    const [showModal, setShowModal] = useState(false);
    const handleClick = () => setShowModal(!showModal);

    const mainNode = document.querySelector("main");

    if (mainNode === null) {
        return (
            <button type="button" onClick={handleClick}>
                <ChatOutlined
                    className="rounded-sm text-primary drop-shadow-[0_0_0.3rem_#ffffff70] focus:bg-controlsSelected "
                    width={42}
                    height="100%"
                />
            </button>
        );
    }

    const ChatIcon = showModal ? ChatFilled : ChatOutlined;

    return (
        <>
            <button type="button" className="" onClick={handleClick}>
                <ChatIcon
                    className="rounded-lg p-2 text-primary drop-shadow-[0_0_0.3rem_#ffffff70] hover:bg-primary/30 hover:text-white focus:bg-controlsSelected "
                    width={48}
                    height={48}
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
