import ChatRoomList from "./ChatRoomList";
import ChatMainPage from "./ChatMainPage";
import ChatMemberList from "./ChatMemberList";

export default function ChatLayout() {
    return (
        <div className="backblur flex h-full w-full flex-row justify-start bg-windowGlass/30 before:backdrop-blur-[50px]">
            <input
                className="peer/left hidden"
                type="radio"
                name="leftRadio"
                id="leftSideBarIcon"
            />
            <ChatRoomList />
            <ChatMainPage />
            <input
                className="peer/right hidden"
                type="radio"
                name="rightRadio"
                id="rightSideBarIcon"
                defaultChecked
            />
            <ChatMemberList />
        </div>
    );
}
