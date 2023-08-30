import { MenuItem } from "./MenuItem";
import { ChatMemberModeFlags } from "@/library/payload/chat-payloads";

type ChatRoomHeaderMenu = {
    name: string;
    onClick: () => void;
    modeFlags: number;
    isImportant: boolean;
};

const chatRoomHeaderMenus: ChatRoomHeaderMenu[] = [
    {
        name: "알림 설정",
        onClick: () => { },
        modeFlags: 0, // TODO: 권한 플래그 없는 메뉴에 0? null ? undefined?
        isImportant: false,
    },
    {
        name: "소유권 양도",
        onClick: () => { },
        modeFlags: ChatMemberModeFlags.ADMIN,
        isImportant: false,
    },
    {
        name: "매니저 지정",
        onClick: () => { },
        modeFlags: ChatMemberModeFlags.ADMIN | ChatMemberModeFlags.MANAGER,
        isImportant: false,
    },
    {
        name: "채팅방 삭제",
        onClick: () => { },
        modeFlags: ChatMemberModeFlags.ADMIN,
        isImportant: true,
    },
    {
        name: "방 나가기",
        onClick: () => { },
        modeFlags: 0,
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
    return (
        <div
            className={`${className} flex-col items-center text-base font-bold text-gray-100/80`}
        >
            {chatRoomHeaderMenus
                .filter((menu) => menu.modeFlags === 0 || (modeFlags & menu.modeFlags))
                .map((menu) => {
                    return (
                        <MenuItem
                            key={menu.name}
                            className={`active:bg-secondary/80 ${menu.isImportant ? "hover:bg-red-500/80" : ""
                                }`}
                            onClick={menu.onClick}
                        >
                            {menu.name}
                        </MenuItem>
                    );
                })}
        </div>
    );
}
