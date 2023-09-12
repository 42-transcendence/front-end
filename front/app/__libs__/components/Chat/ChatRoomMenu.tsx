"use client";

import { MenuItem } from "./MenuItem";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import { useChatMember } from "@hooks/useChatRoom";
import { useChatRoomMenuActions } from "./useChatRoomMenuActions";
import { useChatRoomHeaderMenus } from "./useChatRoomHeaderMenus";

export function ChatRoomMenu({ className }: { className: string }) {
    const currentAccountUUID = useCurrentAccountUUID();
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const selfMember = useChatMember(currentChatRoomUUID, currentAccountUUID);
    const roleLevel = Number(selfMember?.role ?? 0);
    const actions = useChatRoomMenuActions(currentChatRoomUUID);
    const menus = useChatRoomHeaderMenus(currentChatRoomUUID);

    return (
        <div
            className={`${className} flex-col items-center text-base font-bold text-gray-100/80`}
        >
            {currentChatRoomUUID !== "" &&
                menus
                    .filter((menu) => roleLevel >= (menu.minRoleLevel ?? 0))
                    .map((menu) => {
                        return (
                            <MenuItem
                                key={menu.action}
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
