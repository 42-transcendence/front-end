import { FriendButton } from "./FriendButton";
import { ChatButton } from "./ChatButton";
import { ProfileButton } from "./ProfileButton";
import { MatchMakerWrapper } from "./MatchMaker";
import { HomeButton } from "./HomeButton";

export function NavigationBar() {
    return (
        <div className="relative flex h-fit w-full flex-row items-center justify-between bg-primary/30 p-2 backdrop-blur-[20px] backdrop-brightness-100">
            <HomeButton />
            <MatchMakerWrapper />
            <div className="relative flex flex-row items-center justify-between gap-4">
                <ChatButton />
                <FriendButton />
                <ProfileButton />
            </div>
        </div>
    );
}

export function GameNavigationBar() {
    return (
        <div className="relative flex h-fit w-full flex-row items-center justify-between bg-yellow-600/30 p-2 backdrop-blur-[20px] backdrop-brightness-100">
            <HomeButton />
            <div className="relative flex flex-row items-center justify-between gap-4">
                <ChatButton />
                <FriendButton />
                <ProfileButton />
            </div>
        </div>
    );
}
