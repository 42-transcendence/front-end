"use client";

import { MenuItem } from "./MenuItem";
import { ChatMemberModeFlags } from "@/library/payload/chat-payloads";
import { useCurrentChatRoomUUID } from "@/hooks/useCurrent";
import { useWebSocket } from "@/library/react/websocket-hook";
import {
    ChatClientOpcode,
    ChatServerOpcode,
} from "@/library/payload/chat-opcodes";
import { ByteBuffer } from "@/library/akasha-lib";

type ChatRoomActions =
    | "notification"
    | "transfer"
    | "grant"
    | "delete"
    | "leave";

type ChatRoomHeaderMenu = {
    name: string;
    action: ChatRoomActions;
    modeFlags: number | undefined;
    isImportant: boolean;
};

const chatRoomHeaderMenus: ChatRoomHeaderMenu[] = [
    {
        name: "알림 설정",
        action: "notification",
        modeFlags: undefined,
        isImportant: false,
    },
    {
        name: "소유권 양도",
        action: "transfer",
        modeFlags: ChatMemberModeFlags.ADMIN,
        isImportant: false,
    },
    {
        name: "매니저 지정",
        action: "grant",
        modeFlags: ChatMemberModeFlags.ADMIN /* | ChatMemberModeFlags.MANAGER*/, //NOTE: 매니저는 매니저를 지정할 수 없어야 함.
        isImportant: false,
    },
    {
        name: "채팅방 삭제",
        action: "delete",
        modeFlags: ChatMemberModeFlags.ADMIN,
        isImportant: true,
    },
    {
        name: "방 나가기",
        action: "leave",
        modeFlags: undefined,
        isImportant: true,
    },
];

export function ChatRoomMenu({
    className,
    modeFlags,
}: {
    className: string;
    modeFlags: number;
}) {
    const currentChatRoomUUID = useCurrentChatRoomUUID();

    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.LEAVE_ROOM_RESULT,
        (_, buf) => {
            const errno = buf.read1();
            if (errno !== 0) {
                alert("방 나가기 실패!!!" + errno);
                //FIXME: enum으로 고치고, 적절히 토스트 띄우기?
            }
        },
    );

    const actions = {
        ["notification"]: () => {},
        ["transfer"]: () => {},
        ["grant"]: () => {},
        ["delete"]: () => {},
        ["leave"]: () => {
            if (confirm("정말로 나가시겠습니까?")) {
                const buf = ByteBuffer.createWithOpcode(
                    ChatServerOpcode.LEAVE_ROOM,
                );
                buf.writeUUID(currentChatRoomUUID);
                sendPayload(buf);
            }
        },
    };

    return (
        <div
            className={`${className} flex-col items-center text-base font-bold text-gray-100/80`}
        >
            {currentChatRoomUUID !== "" &&
                chatRoomHeaderMenus
                    .filter(
                        (menu) =>
                            menu.modeFlags === undefined ||
                            (modeFlags & menu.modeFlags) !== 0,
                    )
                    .map((menu) => {
                        return (
                            <MenuItem
                                key={menu.name}
                                className={`active:bg-secondary/80 ${
                                    menu.isImportant
                                        ? "hover:bg-red-500/80"
                                        : ""
                                }`}
                                onClick={actions[menu.action]}
                            >
                                {menu.name}
                            </MenuItem>
                        );
                    })}
        </div>
    );
}
