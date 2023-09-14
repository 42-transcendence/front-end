import { Icon } from "@components/ImageLibrary";
import { Avatar } from "@components/Avatar";
import type {
    ChatBanSummaryEntry,
    ChatDirectEntry,
    ChatRoomViewEntry,
} from "@common/chat-payloads";
import { ChatErrorNumber, toChatRoomModeFlags } from "@common/chat-payloads";
import { ChatRoomModeFlags, type ChatRoomEntry } from "@common/chat-payloads";
import { useSetAtom } from "jotai";
import {
    CurrentChatRoomUUIDAtom,
    LeftSideBarIsOpenAtom,
} from "@atoms/ChatAtom";
import {
    useChatRoomLatestMessage,
    useChatRoomListAtom,
    useChatRoomMembers,
    useChatRoomModeFlags,
    useChatRoomUnreadCount,
} from "@hooks/useChatRoom";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import {
    isDirectChatKey,
    makeDirectChatKey,
} from "@akasha-utils/idb/chat-store";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { handleEnterRoomResult } from "@akasha-utils/chat-gateway-client";
import { makeEnterRoomRequest } from "@akasha-utils/chat-payload-builder-client";
import { digestMessage, encodeUTF8 } from "@akasha-lib";
import { handleChatError } from "./handleChatError";
import { useCallback } from "react";
import { DefaultAvatar } from "@components/Avatar/Avatar";

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

export function prettifyBanSummaryEntries(bans: ChatBanSummaryEntry[]) {
    return bans
        .map((ban) => {
            const reason = ban.reason;
            const expire = ban.expireTimestamp?.toLocaleDateString() ?? null;

            return `사유: ${reason}\n${expire !== null && "기한: " + expire}`;
        })
        .join("\n\n");
}

function RoomBlockThumbnail({
    isAccountUUID,
    uuid,
}: {
    isAccountUUID: boolean;
    uuid: string;
}) {
    return (
        <div className="flex w-fit items-center justify-center gap-2.5">
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-600">
                {isAccountUUID ? (
                    <Avatar
                        className="relative h-10 w-10"
                        accountUUID={uuid}
                        privileged={false}
                    />
                ) : (
                    <DefaultAvatar className="relative h-10 w-10" uuid={uuid} />
                )}
            </div>
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
    const chatRoomMembers = useChatRoomMembers(roomUUID);
    const setChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom);
    const lastMessageContent = latestMessage?.content ?? "채팅을 시작해보세요!";
    const modeFlags = modeFlagsRaw ?? 0;
    const setLeftSideBar = useSetAtom(LeftSideBarIsOpenAtom);

    const handleClick = () => {
        setChatRoomUUID(chatRoom.id);
        setLeftSideBar(false);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="relative w-full rounded-lg px-2 outline-none focus-within:outline-primary/70 hover:bg-primary/30 active:bg-secondary/80"
        >
            <div className="flex h-fit flex-row items-center gap-4 self-stretch">
                <RoomBlockThumbnail isAccountUUID={false} uuid={roomUUID} />
                <ChatRoomInfo
                    lastMessageContent={lastMessageContent}
                    modeFlags={modeFlags}
                    optionalInfo={{
                        membersCount: chatRoomMembers?.size ?? 0,
                        numberOfUnreadMessages: numberOfUnreadMessages,
                    }}
                    chatRoomId={chatRoom.id}
                >
                    {children}
                </ChatRoomInfo>
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

    const handleClick = () => {
        setChatRoomUUID(roomUUID);
        setLeftSideBar(false);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="relative w-full rounded-lg px-2 outline-none focus-within:outline-primary/70 hover:bg-primary/30 active:bg-secondary/80"
        >
            <div className="flex h-fit flex-row items-center gap-4 self-stretch">
                <RoomBlockThumbnail
                    isAccountUUID={true}
                    uuid={chatRoom.targetAccountId}
                />
                <ChatRoomInfo
                    chatRoomId={roomUUID}
                    modeFlags={modeFlags}
                    lastMessageContent={lastMessageContent}
                    optionalInfo={{
                        numberOfUnreadMessages: numberOfUnreadMessages,
                    }}
                >
                    {children}
                </ChatRoomInfo>
            </div>
        </button>
    );
}

export function ChatPublicRoomBlock({
    children,
    chatRoom,
}: React.PropsWithChildren<{
    chatRoom: ChatRoomViewEntry;
}>) {
    const setChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom);
    const modeFlags = toChatRoomModeFlags({
        isPrivate: chatRoom.isPrivate,
        isSecret: chatRoom.isSecret,
    });
    const setLeftSideBar = useSetAtom(LeftSideBarIsOpenAtom);
    const [chatRoomList] = useChatRoomListAtom();
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.ENTER_ROOM_RESULT,
        (_, payload) => {
            const [errno, chatId, bans] = handleEnterRoomResult(payload);
            if (chatId === chatRoom.id) {
                //FIXME: 정상 , 차단 두 경우 테스트해보기
                if (errno !== ChatErrorNumber.SUCCESS) {
                    if (bans !== undefined) {
                        alert(
                            "해당 채팅방 입장을 정지당했습니다.\n" +
                                prettifyBanSummaryEntries(bans),
                        );
                    } else {
                        handleChatError(errno);
                    }
                } else {
                    setChatRoomUUID(chatRoom.id);
                    setLeftSideBar(false);
                }
            }
        },
    );

    const isAlreadyChatPublicRoomMember =
        chatRoomList.find((e) => e.id === chatRoom.id) !== undefined;

    const lastMessageContent = isAlreadyChatPublicRoomMember
        ? "참여중인 채팅방입니다"
        : "새로운 채팅에 참여해 보세요!";

    const sendEnterRoomRequestAsync = useCallback(async () => {
        if (confirm(`${chatRoom.title} 에 입장하시겠습니까?`)) {
            let password = "";
            if (chatRoom.isSecret) {
                const passwordRaw = prompt(
                    "비밀 방입니다. 비밀번호를 입력해주세요",
                );
                if (passwordRaw === null) {
                    return;
                }
                password = btoa(
                    String.fromCharCode(
                        ...(await digestMessage(
                            "SHA-256",
                            encodeUTF8(passwordRaw),
                        )),
                    ),
                );
            }
            sendPayload(makeEnterRoomRequest(chatRoom.id, password));
        }
    }, [chatRoom.id, chatRoom.isSecret, chatRoom.title, sendPayload]);

    const handleClick = () => {
        if (isAlreadyChatPublicRoomMember) {
            setChatRoomUUID(chatRoom.id);
        } else {
            sendEnterRoomRequestAsync().catch(() => {});
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="relative w-full rounded-lg px-2 outline-none focus-within:outline-primary/70 hover:bg-primary/30 active:bg-secondary/80"
        >
            <div className="flex h-fit flex-row items-center gap-4 self-stretch">
                <RoomBlockThumbnail isAccountUUID={false} uuid={chatRoom.id} />
                <ChatRoomInfo
                    chatRoomId={chatRoom.id}
                    lastMessageContent={lastMessageContent}
                    modeFlags={modeFlags}
                    optionalInfo={{ membersCount: chatRoom.memberCount }}
                >
                    {children}
                </ChatRoomInfo>
            </div>
        </button>
    );
}

function ChatRoomInfo({
    chatRoomId,
    children,
    modeFlags,
    lastMessageContent,
    optionalInfo,
}: React.PropsWithChildren<{
    chatRoomId: string;
    modeFlags: number;
    lastMessageContent: string;
    optionalInfo: {
        membersCount?: number | undefined;
        numberOfUnreadMessages?: number | undefined;
    };
}>) {
    const isDMRoom = isDirectChatKey(chatRoomId);
    return (
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
                    {!isDMRoom && (
                        <Icon.Person
                            width={12}
                            height={12}
                            className="text-gray-200/70"
                        />
                    )}
                    {optionalInfo.membersCount !== undefined && (
                        <span className=" text-[12px] leading-3 text-gray-50/50">
                            {optionalInfo.membersCount}
                        </span>
                    )}
                </div>
                {optionalInfo.numberOfUnreadMessages !== undefined && (
                    <UnreadMessageBadge
                        count={optionalInfo.numberOfUnreadMessages}
                    />
                )}
            </div>
        </div>
    );
}
