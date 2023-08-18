"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IconChatOutlined, IconChatFilled } from "@/components/ImageLibrary";

export function SocialButton() {
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);

    const ChatIcon = pathname === "/chat" ? IconChatFilled : IconChatOutlined;

    const handleClick = () => {
        setPrevPathname(pathname);
    };

    return (
        <Link
            href={pathname === "/chat" ? prevPathname : "/chat"}
            onClick={handleClick}
        >
            <ChatIcon className="h-12 w-12 rounded-lg p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30] hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary 2xl:h-14 2xl:w-14" />
        </Link>
    );
}
