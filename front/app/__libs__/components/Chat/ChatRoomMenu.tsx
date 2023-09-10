"use client";

import { MenuItem } from "./MenuItem";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
    useResetCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { RoleNumber } from "@common/generated/types";
import { useChatMember } from "@hooks/useChatRoom";
import {
    handleChangeRoomPropertyResult,
    handleDestroyRoomResult,
    handleLeaveRoomResult,
} from "@akasha-utils/chat-gateway-client";
import { ChatErrorNumber, toChatRoomModeFlags } from "@common/chat-payloads";
import {
    makeChangeMemberRoleRequest,
    makeChangeRoomPropertyRequest,
    makeDestroyRoomRequest,
    makeHandoverRoomOwnerRequest,
    makeLeaveRoomRequest,
} from "@akasha-utils/chat-payload-builder-client";
import { handleChatError } from "./handleChatError";
import { MAX_CHAT_MEMBER_CAPACITY } from "@common/chat-constants";

type ChatRoomActions =
    | "notification"
    | "changeChatRoomTitle"
    | "changeChatRoomMode"
    | "changeChatRoomLimit"
    | "delete"
    | "leave";

type ChatRoomHeaderMenu = {
    name: string;
    action: ChatRoomActions;
    minRoleLevel: number | undefined;
    isImportant: boolean;
};

const chatRoomHeaderMenus: ChatRoomHeaderMenu[] = [
    {
        name: "알림 설정",
        action: "notification",
        minRoleLevel: undefined,
        isImportant: false,
    },
    {
        name: "방 제목 변경",
        action: "changeChatRoomTitle",
        minRoleLevel: RoleNumber.MANAGER,
        isImportant: false,
    },
    {
        name: "방 설정 변경",
        action: "changeChatRoomMode",
        minRoleLevel: RoleNumber.ADMINISTRATOR,
        isImportant: false,
    },
    {
        name: "방 인원제한 변경",
        action: "changeChatRoomLimit",
        minRoleLevel: RoleNumber.MANAGER,
        isImportant: false,
    },
    {
        name: "채팅방 삭제",
        action: "delete",
        minRoleLevel: RoleNumber.ADMINISTRATOR,
        isImportant: true,
    },
    {
        name: "방 나가기",
        action: "leave",
        minRoleLevel: undefined,
        isImportant: true,
    },
];

export function ChatRoomMenu({ className }: { className: string }) {
    const currentAccountUUID = useCurrentAccountUUID();
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const resetCurrentChatRoomUUID = useResetCurrentChatRoomUUID();
    const selfMember = useChatMember(currentChatRoomUUID, currentAccountUUID);
    const roleLevel = Number(selfMember?.role ?? 0);

    const { sendPayload } = useWebSocket(
        "chat",
        [
            ChatClientOpcode.CHANGE_ROOM_PROPERTY_RESULT,
            ChatClientOpcode.LEAVE_ROOM_RESULT,
            ChatClientOpcode.DESTROY_ROOM_RESULT,
        ],
        (opcode, buf) => {
            switch (opcode) {
                case ChatClientOpcode.CHANGE_ROOM_PROPERTY_RESULT: {
                    const [errno, chatId] = handleChangeRoomPropertyResult(buf);
                    if (errno !== ChatErrorNumber.SUCCESS) {
                        handleChatError(errno);
                    } else {
                        alert("설정을 변경했습니다");
                    }
                    break;
                }
                case ChatClientOpcode.LEAVE_ROOM_RESULT: {
                    const [errno, chatId] = handleLeaveRoomResult(buf);
                    if (errno !== ChatErrorNumber.SUCCESS) {
                        handleChatError(errno);
                    } else {
                        resetCurrentChatRoomUUID();
                    }
                    break;
                }
                case ChatClientOpcode.DESTROY_ROOM_RESULT: {
                    const [errno, chatId] = handleDestroyRoomResult(buf);
                    if (errno !== ChatErrorNumber.SUCCESS) {
                        handleChatError(errno);
                    } else {
                        resetCurrentChatRoomUUID();
                    }
                    break;
                }
            }
        },
    );

    const actions = {
        ["notification"]: () => {},
        ["changeChatRoomTitle"]: () => {
            const newTitle = prompt("새 채팅방 이름을 입력해주세요");
            if (newTitle !== null) {
                const buf = makeChangeRoomPropertyRequest(
                    currentChatRoomUUID,
                    newTitle,
                    undefined,
                    undefined,
                    undefined,
                );
                sendPayload(buf);
            }
        },
        ["changeChatRoomMode"]: () => {
            const isPrivate = confirm("private?");
            const isSecret = confirm("secret?");
            const password = isSecret
                ? prompt("new password?") ?? undefined
                : undefined;
            const modeFlags = toChatRoomModeFlags({
                isPrivate: isPrivate,
                isSecret: isSecret,
            });
            const buf = makeChangeRoomPropertyRequest(
                currentChatRoomUUID,
                undefined,
                modeFlags,
                password,
                undefined,
            );
            sendPayload(buf);
        },
        ["changeChatRoomLimit"]: () => {
            const newLimit = Number(
                prompt(
                    `새 인원제한을 입력해주세요 1 ~ ${MAX_CHAT_MEMBER_CAPACITY}`,
                ),
            );
            if (
                Number.isSafeInteger(newLimit) &&
                newLimit > 0 &&
                newLimit < MAX_CHAT_MEMBER_CAPACITY
            ) {
                const buf = makeChangeRoomPropertyRequest(
                    currentChatRoomUUID,
                    undefined,
                    undefined,
                    undefined,
                    newLimit,
                );
                sendPayload(buf);
            } else {
                alert("올바른 숫자를 입력해 주세요");
            }
        },
        ["delete"]: () => {
            if (confirm("정말로 방을 삭제?")) {
                const buf = makeDestroyRoomRequest(currentChatRoomUUID);
                sendPayload(buf);
            }
        },
        ["leave"]: () => {
            if (confirm("정말로 나가시겠습니까?")) {
                const buf = makeLeaveRoomRequest(currentChatRoomUUID);
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
                    .filter((menu) => roleLevel >= (menu.minRoleLevel ?? 0))
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
