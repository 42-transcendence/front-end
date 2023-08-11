/* eslint-disable react/jsx-no-undef */
import { ChatHeader as ChatHeader } from "./ChatHeader";
import { ChatDialog as ChatDialog } from "./ChatDialog";

export default function ChatMainPage() {
    return (
        <div className="flex-grow-1 relative flex h-full w-full flex-col items-start transition-all 2xl:gap-4 2xl:p-4">
            <ChatHeader />
            <ChatDialog innerFrame={"2xl:rounded-lg"} outerFrame={"w-full"} />
        </div>
    );
}
