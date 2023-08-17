"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { IconChatOutlined, IconChatFilled } from "@/components/ImageLibrary";
import ChatLayout from "../Chat/ChatLayout";

export function SocialButton() {
    const [showModal, setShowModal] = useState(false);

    const handleClick = () => setShowModal(!showModal);
    const ChatIcon = showModal ? IconChatFilled : IconChatOutlined;

    const portalRoot = document.querySelector("main");

    return (
        <>
            <button type="button" onClick={handleClick}>
                <ChatIcon className="h-12 w-12 rounded-lg p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary 2xl:h-14 2xl:w-14" />
            </button>
            {showModal &&
                createPortal(
                    <div className="absolute inset-0 flex h-full w-full flex-col font-extrabold">
                        <ChatLayout />
                    </div>,
                    portalRoot!,
                )}
        </>
    );
}
