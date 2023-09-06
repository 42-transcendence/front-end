import { Icon } from "@/components/ImageLibrary";
import { Avatar } from "@/components/Avatar";
import {
    ChatRoomModeFlags,
    type ChatRoomEntry,
} from "@/library/payload/chat-payloads";
import { useSetAtom } from "jotai";
import {
    CurrentChatRoomUUIDAtom,
    LeftSideBarIsOpenAtom,
} from "@/atom/ChatAtom";
import {
    useChatRoomLatestMessage,
    useChatRoomModeFlags,
    useChatRoomUnreadCount,
} from "@/hooks/useChatRoom";

function UnreadMessageBadge({ count }: { count: number }) {
    if (count === 0) {
        return null;
    }

    return (
        <div className="flex min-w-[22px] flex-col items-center justify-center rounded-md bg-red-500 p-1">
            <span className="flex text-center font-sans font-medium not-italic text-white ">
                {count > 999 ? "999+" : count.toString()}
            </span>
        </div>
    );
}

export default function ChatRoomBlock({
    children,
    chatRoom,
}: React.PropsWithChildren<{
    chatRoom: ChatRoomEntry;
}>) {
    const roomUUID = chatRoom.id;
    const numberOfUnreadMessages = useChatRoomUnreadCount(roomUUID);
    const latestMessage = useChatRoomLatestMessage(roomUUID);
    const modeFlagsRaw = useChatRoomModeFlags(roomUUID);
    const setChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom);
    const lastMessageContent = latestMessage?.content ?? "채팅을 시작해보세요!";
    const modeFlags = modeFlagsRaw ?? 0;
    const setLeftSideBar = useSetAtom(LeftSideBarIsOpenAtom);

    return (
        <button
            onClick={() => {
                setChatRoomUUID(chatRoom.id);
                setLeftSideBar(false);
            }}
            className="relative w-full rounded-lg px-2 hover:bg-primary/30 active:bg-secondary/80"
        >
            {/* chatrooms - image */}
            <div className="flex h-fit flex-row items-center gap-4 self-stretch">
                <div className="flex w-fit items-center justify-center gap-2.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-600">
                        {/* TODO: change to member preview (limit 4)*/}
                        <Avatar
                            className="relative h-10 w-10"
                            accountUUID={chatRoom.members[0].accountId}
                            privileged={false}
                        />
                    </div>
                </div>

                {/* chatrooms - info */}
                <div className="flex h-fit w-full gap-4 py-2">
                    <div className="flex h-16 w-full flex-col p-0">
                        <div className="flex h-8 flex-row items-center gap-2">
                            <span className="relative line-clamp-1 max-w-[8rem] text-start font-sans text-base font-bold tracking-normal text-white/90">
                                {children}
                            </span>
                            {(modeFlags & ChatRoomModeFlags.PRIVATE) !== 0 && (
                                <span className="flex h-fit w-fit shrink-0 flex-row gap-1">
                                    <Icon.Lock
                                        width={12}
                                        height={12}
                                        className="text-yellow-200/70"
                                    />
                                </span>
                            )}
                            {(modeFlags & ChatRoomModeFlags.SECRET) !== 0 && (
                                <span className="flex h-fit w-fit shrink-0 flex-row gap-1">
                                    <Icon.Key
                                        width={12}
                                        height={12}
                                        className="text-yellow-200/70"
                                    />
                                </span>
                            )}
                        </div>

                        <div className="line-clamp-2 max-w-[160px] break-words text-start font-sans text-xs font-normal text-gray-200">
                            {lastMessageContent}
                        </div>
                    </div>

                    <div className="relative flex flex-col items-end gap-4 text-xs leading-3">
                        <div className="flex shrink-0 flex-row gap-1">
                            <Icon.Person
                                width={12}
                                height={12}
                                className="text-gray-200/70"
                            />
                            <span className=" text-[12px] leading-3 text-gray-50/50">
                                {chatRoom.members.length}
                            </span>
                        </div>
                        <UnreadMessageBadge
                            count={numberOfUnreadMessages ?? 0}
                        />
                    </div>
                </div>
            </div>
        </button>
    );
}
