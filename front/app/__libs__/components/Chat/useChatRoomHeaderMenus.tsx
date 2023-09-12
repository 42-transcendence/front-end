"use client";
import { RoleNumber } from "@common/generated/types";
import { useChatRoomModeFlags } from "@hooks/useChatRoom";
import { ChatRoomModeFlags } from "@common/chat-payloads";

type ChatRoomActions =
    | "changeChatRoomTitle"
    | "changeChatRoomVisibility"
    | "changeChatRoomPassword"
    | "changeChatRoomLimit"
    | "delete"
    | "leave";

type ChatRoomHeaderMenu = {
    name: string;
    action: ChatRoomActions;
    minRoleLevel: number | undefined;
    isImportant: boolean;
};

export function useChatRoomHeaderMenus(currentChatRoomUUID: string) {
    const currentModeFlags = useChatRoomModeFlags(currentChatRoomUUID);

    if (currentModeFlags === undefined) {
        return [];
    }

    const isPrivate = (currentModeFlags & ChatRoomModeFlags.PRIVATE) !== 0;

    const chatRoomHeaderMenus: ChatRoomHeaderMenu[] = [
        {
            name: "제목 변경",
            action: "changeChatRoomTitle",
            minRoleLevel: RoleNumber.MANAGER,
            isImportant: false,
        },
        {
            name: isPrivate ? "공개방으로 설정" : "비공개 방으로 설정",
            action: "changeChatRoomVisibility",
            minRoleLevel: RoleNumber.ADMINISTRATOR,
            isImportant: false,
        },
        {
            name: "비밀번호 설정",
            action: "changeChatRoomPassword",
            minRoleLevel: RoleNumber.ADMINISTRATOR,
            isImportant: false,
        },
        {
            name: "인원제한 변경",
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

    return chatRoomHeaderMenus;
}
