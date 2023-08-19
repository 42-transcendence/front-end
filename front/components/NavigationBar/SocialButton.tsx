"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IconChatOutlined, IconChatFilled } from "@/components/ImageLibrary";

export function SocialButton() {
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);
    const isOnChatPage = pathname === "/chat";

    const ChatIcon = isOnChatPage ? IconChatFilled : IconChatOutlined;

    const handleClick = () => {
        setPrevPathname(pathname);
    };

    // TODO: href 이동으로 인한 pathname 업데이트와 handleClick 내부
    // setPrevPathname 사이의 실행순서가 보장되는가?
    return (
        <Link
            href={isOnChatPage ? prevPathname : "/chat"}
            onClick={handleClick}
        >
            <ChatIcon className="h-12 w-12 rounded-lg p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary 2xl:h-14 2xl:w-14" />
        </Link>
    );
}
