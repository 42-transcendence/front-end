"use client";
import ChattingSideBar from "../ChattingSideBar/ChattingSideBar";
import ChatMainPage from "../ChatMainPage/ChatMainPage";
import { NavigationBar } from "../NavigationBar";
// import {
//     blankStar,
//     chat,
//     chatFromLeft,
//     check,
//     doubleSharp,
//     edit,
//     externalWindow,
//     externalWindowInsideWindow,
//     filledStar,
//     friend,
//     lock,
//     password,
//     search,
//     setting,
//     sidebar,
//     social,
// } from "../../Icon";

export function ChatLayout(): React.ReactElement {
    return (
        <>
            <div>
                <NavigationBar />
            </div>
            <div className="felx h-screen flex-row justify-start">
                <ChattingSideBar />
                {/* <ChatMainPage/> */}
            </div>
        </>
    );
}

export default ChatLayout;
