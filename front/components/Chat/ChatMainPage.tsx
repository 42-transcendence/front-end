/* eslint-disable react/jsx-no-undef */
import { ChatHeader as ChatHeader } from "./ChatHeader";
import { ChatDialog as ChatDialog } from "./ChatDialog";

export default function ChatMainPage() {
    return (
        <div className="flex h-full w-full flex-col items-start p-4">
            <ChatHeader />
            <ChatDialog rounded={"rounded-lg"} width={"w-full"} />
        </div>
    );
}
