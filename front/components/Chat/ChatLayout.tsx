import { LeftSideBarInput } from "./ChatHeader";
import ChatLeftSideBar from "./ChatLeftSideBar";
import ChatMainPage from "./ChatMainPage";
import ChatRightSideBar from "./ChatRightSideBar";

export default function ChatLayout() {
    return (
        <div className="gradient-border back-full flex h-full w-full items-center justify-center rounded-[28px] p-px before:rounded-[28px] before:p-px 2xl:min-w-[80rem]">
            <div className="back-full relative flex h-full w-full flex-row overflow-hidden rounded-[28px] bg-windowGlass/30 before:backdrop-blur-[50px]">
                <LeftSideBarInput />
                <ChatLeftSideBar />
                <ChatMainPage />
                <input
                    className="peer/right hidden"
                    type="radio"
                    name="rightRadio"
                    id="rightSideBarIcon"
                    defaultChecked
                />
                <ChatRightSideBar />
            </div>
        </div>
    );
}
