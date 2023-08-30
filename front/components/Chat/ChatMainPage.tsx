import { ChatHeader } from "./ChatHeader";
import { ChatDialog } from "./ChatDialog";

export default function ChatMainPage() {
    return (
        <div className="flex-grow-1 relative flex h-full w-full flex-col items-start bg-transparent transition-all 2xl:gap-4 2xl:p-4">
            <ChatHeader />
            <ChatDialog innerFrame={"2xl:rounded-lg"} outerFrame={"w-full"} />
        </div>
    );
}
