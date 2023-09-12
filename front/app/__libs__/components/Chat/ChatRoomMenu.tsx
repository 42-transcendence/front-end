"use client";

import { MenuItem } from "./MenuItem";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import { RoleNumber } from "@common/generated/types";
import { useChatMember } from "@hooks/useChatRoom";
import { useChatRoomMenuActions } from "./useChatRoomMenuActions";

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

const chatRoomHeaderMenus: ChatRoomHeaderMenu[] = [
    {
        name: "제목 변경",
        action: "changeChatRoomTitle",
        minRoleLevel: RoleNumber.MANAGER,
        isImportant: false,
    },
    {
        name: "공개 설정 변경",
        action: "changeChatRoomVisibility",
        minRoleLevel: RoleNumber.ADMINISTRATOR,
        isImportant: false,
    },
    {
        name: "비밀번호 변경",
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

export function ChatRoomMenu({ className }: { className: string }) {
    const currentAccountUUID = useCurrentAccountUUID();
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const selfMember = useChatMember(currentChatRoomUUID, currentAccountUUID);
    const roleLevel = Number(selfMember?.role ?? 0);
    const actions = useChatRoomMenuActions(currentChatRoomUUID);

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
