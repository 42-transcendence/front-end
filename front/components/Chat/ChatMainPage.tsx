/* eslint-disable react/jsx-no-undef */
import { ChatHeader as ChatHeader } from "./ChatHeader";
import { ChatDialog as ChatDialog } from "./ChatDialog";

export default function ChatMainPage() {
    return (
        <div className="relative flex h-full w-full flex-col items-start p-4">
            <ChatHeader />
            <ChatDialog innerFrame={"rounded-lg"} outerFrame={"w-full"} />
        </div>
    );
}
