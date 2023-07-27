/* eslint-disable react/jsx-no-undef */
import { Icon } from "../Icon/Icon";
import { ChatHeader as ChatHeader } from "./ChatHeader";
import { Dialog as ChatDialog } from "./Dialog";

export default function ChatMainPage() {
    return (
        <div className="flex h-full w-full flex-col rounded-[28px_28px_0px_0px] pb-0 pl-[11px] pr-0 pt-[5px] backdrop-blur-[50px]">
            <ChatHeader />
            <ChatDialog />
        </div>
    );
}
