/* eslint-disable react/jsx-no-undef */
// import { Icon } from "../Icon/Icon";
import { ChatHeader as ChatHeader } from "./ChatHeader";
import { ChatDialog as ChatDialog } from "./ChatDialog";

export default function ChatMainPage() {
    return (
        <div className="flex h-full w-full flex-col pb-0 pl-[11px] pr-0 pt-[5px] ">
            <ChatHeader />
            <ChatDialog rounded={"rounded-sm"} width={"w-full"} />
        </div>
    );
}
