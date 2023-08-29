"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Icon } from "@/components/ImageLibrary";

export function SocialButton() {
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);
    const isOnChatPage = pathname === "/chat";

    const ChatIcon = isOnChatPage ? Icon.ChatFilled : Icon.ChatOutlined;

    const handleClick = () => {
        setPrevPathname(pathname);
    };

    // TODO: href 이동으로 인한 pathname 업데이트와 handleClick 내부
    // setPrevPathname 사이의 실행순서가 보장되는가?

    // TODO: get from getlastreadmessage that unreaded messages
    const unreadedMessages = 123;

    return (
        <Link
            href={isOnChatPage ? prevPathname : "/chat"}
            onClick={handleClick}
        >
            <div className="relative flex rounded-lg hover:bg-primary/30 hover:text-white/80 focus:bg-controlsSelected active:bg-secondary">
                <ChatIcon className="h-12 w-12  p-2 shadow-white drop-shadow-[0_0_0.1rem_#ffffff30]  2xl:h-14 2xl:w-14" />
                <div className="absolute right-0 top-0 flex h-fit w-fit min-w-[1.25rem] justify-center rounded-lg bg-red-500/90 p-1">
                    <span className="rounded-full text-xs leading-3">
                        {unreadedMessages}
                    </span>
                </div>
            </div>
        </Link>
    );
}
