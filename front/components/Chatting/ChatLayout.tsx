"use client";
import ChatSideBar from "./ChatSideBar";
import ChatMainPage from "./ChatMainPage";
import { NavigationBar } from "../NavigationBar";

export function ChatLayout(): React.ReactElement {
    return (
        <>
            <div>
                <NavigationBar />
            </div>
            <div className="flex h-full flex-row justify-start">
                <ChatSideBar />
                <ChatMainPage />
            </div>
        </>
    );
}

export default ChatLayout;
