import Link from "next/link";
import { DoubleSharp } from "@components/ImageLibrary";
import { FriendButton } from "./FriendButton";
import { ChatButton } from "./ChatButton";
import { ProfileButton } from "./ProfileButton";

export function NavigationBar() {
    return (
        <div className="relative flex h-fit w-full flex-row items-center justify-between bg-primary/30 p-2 backdrop-blur-[20px] backdrop-brightness-100">
            <Link tabIndex={-1} className="relative" href="/">
                <DoubleSharp
                    tabIndex={0}
                    className="w-12 rounded-lg p-2 text-white outline-none transition-all hover:drop-shadow-[0_0_0.3rem_#ffffff90] focus-visible:outline-primary/70"
                    width={48}
                    height={48}
                />
            </Link>
            {/* TODO: matching 대기중이면 중간에 정보 표시? */}
            <div className="relative flex flex-row items-center justify-between gap-4">
                <ChatButton />
                <FriendButton />
                {/* TODO: on click Avatar in navbar, show context menu myinfo */}
                <ProfileButton />
            </div>
        </div>
    );
}
