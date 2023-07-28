"use client";
import ChatSideBar from "./ChatSideBar";
import ChatMainPage from "./ChatMainPage";

export function ChatLayout(): React.ReactElement {
    return (
        <div className="flex h-full flex-row justify-start">
            <ChatSideBar />
            <ChatMainPage />
        </div>
    );
}

export default ChatLayout;
