import { ChatHeader } from "./ChatHeader";
import { ChatDialog } from "./ChatDialog";

export default function ChatMainPage() {
    const isAdmin = true; // TODO: get chat room dialog info from props
    return (
        <div className="flex-grow-1 relative flex h-full w-full flex-col items-start transition-all 2xl:gap-4 2xl:p-4">
            <ChatHeader isAdmin={isAdmin} />
            <ChatDialog innerFrame={"2xl:rounded-lg"} outerFrame={"w-full"} />
        </div>
    );
}
