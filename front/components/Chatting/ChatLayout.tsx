"use client";
import ChattingSideBar from "./ChattingSideBar";
import ChatMainPage from "./ChatMainPage";
import { NavigationBar } from "../NavigationBar";

export function ChatLayout(): React.ReactElement {
    return (
        <>
            <div>
                <NavigationBar />
            </div>
            <div className="flex h-fill flex-row justify-start">
                <ChattingSideBar />
                {/* <ChatMainPage/> */}
            </div>
        </>
    );
}

export default ChatLayout;
