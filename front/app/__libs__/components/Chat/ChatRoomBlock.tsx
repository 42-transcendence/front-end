import { Icon } from "@components/ImageLibrary";
import { Avatar } from "@components/Avatar";
import type { ChatDirectEntry, ChatRoomViewEntry } from "@common/chat-payloads";
import { ChatErrorNumber } from "@common/chat-payloads";
import { ChatRoomModeFlags, type ChatRoomEntry } from "@common/chat-payloads";
import { useSetAtom } from "jotai";
import {
    CurrentChatRoomUUIDAtom,
    LeftSideBarIsOpenAtom,
} from "@atoms/ChatAtom";
import {
    useChatRoomLatestMessage,
    useChatRoomListAtom,
    useChatRoomModeFlags,
    useChatRoomUnreadCount,
} from "@hooks/useChatRoom";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { makeDirectChatKey } from "@akasha-utils/idb/chat-store";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { handleEnterRoomResult } from "@akasha-utils/chat-gateway-client";
import { makeEnterRoomRequest } from "@akasha-utils/chat-payload-builder-client";
import bcrypt from "bcrypt";
import { CHAT_PASSWORD_BCRYPT_LOG_ROUNDS } from "@common/chat-constants";

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

export function ChatRoomBlock({
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
            className="relative w-full rounded-lg px-2 outline-none focus-within:outline-primary/70 hover:bg-primary/30 active:bg-secondary/80"
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

export function ChatDirectRoomBlock({
    children,
    chatRoom,
}: React.PropsWithChildren<{
    chatRoom: ChatDirectEntry;
}>) {
    const currentAcountUUID = useCurrentAccountUUID();
    const roomUUID = makeDirectChatKey(
        currentAcountUUID,
        chatRoom.targetAccountId,
    );
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
                setChatRoomUUID(roomUUID);
                setLeftSideBar(false);
            }}
            className="relative w-full rounded-lg px-2 outline-none focus-within:outline-primary/70 hover:bg-primary/30 active:bg-secondary/80"
        >
            {/* chatrooms - image */}
            <div className="flex h-fit flex-row items-center gap-4 self-stretch">
                <div className="flex w-fit items-center justify-center gap-2.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-600">
                        {/* TODO: change to member preview (limit 4)*/}
                        <Avatar
                            className="relative h-10 w-10"
                            accountUUID={chatRoom.targetAccountId}
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

// 1. confirm 들어갈래? 2. password 3. 이미 들어가있는방 목록에서 표시

export function ChatPublicRoomBlock({
    children,
    chatRoom,
}: React.PropsWithChildren<{
    chatRoom: ChatRoomViewEntry;
}>) {
    //const roomUUID = chatRoom.id;
    //const numberOfUnreadMessages = useChatRoomUnreadCount(roomUUID);
    //const latestMessage = useChatRoomLatestMessage(roomUUID);
    //const modeFlagsRaw = useChatRoomModeFlags(roomUUID);
    const setChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom);
    const lastMessageContent = "새로운 채팅방에 참여해보세요!"; //latestMessage?.content ?? "채팅을 시작해보세요!";
    //const modeFlags = modeFlagsRaw ?? 0;
    const setLeftSideBar = useSetAtom(LeftSideBarIsOpenAtom);
    const [chatRoomList] = useChatRoomListAtom();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.ENTER_ROOM_RESULT,
        (_, payload) => {
            const [errno, chatId, bans] = handleEnterRoomResult(payload);
            if (chatId === chatRoom.id) {
                //FIXME: 더 정상적으로 처리
                if (errno === ChatErrorNumber.SUCCESS) {
                    setChatRoomUUID(chatRoom.id);
                    setLeftSideBar(false);
                } else {
                    alert(
                        `입장 실패... ${errno}, ${chatId}, ${
                            bans?.toString() ?? ""
                        }`,
                    );
                }
            }
        },
    );

    const isAlreadyChatPublicRoomMember =
        chatRoomList.find((e) => e.id === chatRoom.id) !== undefined;
    //FIXME: 이미 들어간 방 표시

    return (
        <button
            onClick={() => {
                if (isAlreadyChatPublicRoomMember) {
                    setChatRoomUUID(chatRoom.id);
                } else {
                    if (confirm(`${chatRoom.title} 에 입장하시겠습니까?`)) {
                        let password: string | null = "";
                        if (chatRoom.isSecret) {
                            password = prompt(
                                "비밀 방입니다. 비밀번호를 입력해주세요",
                            );
                            if (password === null) {
                                return;
                            }
                            password = bcrypt.hashSync(
                                password,
                                CHAT_PASSWORD_BCRYPT_LOG_ROUNDS,
                            );
                        }
                        sendPayload(
                            makeEnterRoomRequest(chatRoom.id, password),
                        );
                    }
                }
            }}
            className="relative w-full rounded-lg px-2 outline-none focus-within:outline-primary/70 hover:bg-primary/30 active:bg-secondary/80"
        >
            {/* chatrooms - image */}
            <div className="flex h-fit flex-row items-center gap-4 self-stretch">
                <div className="flex w-fit items-center justify-center gap-2.5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-600">
                        {/* TODO: change to member preview (limit 4)*/}
                        <Avatar
                            className="relative h-10 w-10"
                            accountUUID={chatRoom.id} //FIXME: 알 수가 없음.. .
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
                            {chatRoom.isPrivate && (
                                <span className="flex h-fit w-fit shrink-0 flex-row gap-1">
                                    <Icon.Lock
                                        width={12}
                                        height={12}
                                        className="text-yellow-200/70"
                                    />
                                </span>
                            )}
                            {chatRoom.isSecret && (
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
                                {chatRoom.memberCount}
                            </span>
                        </div>
                        {/*<UnreadMessageBadge
                            count={numberOfUnreadMessages ?? 0}
                            />*/}
                    </div>
                </div>
            </div>
        </button>
    );
}
