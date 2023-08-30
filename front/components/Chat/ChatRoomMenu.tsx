import { MenuItem } from "./MenuItem";
import { ChatMemberModeFlags } from "@/library/payload/chat-payloads";

type ChatRoomHeaderMenu = {
    name: string;
    onClick: () => void;
    modeFlags: number | undefined;
    isImportant: boolean;
};

const chatRoomHeaderMenus: ChatRoomHeaderMenu[] = [
    {
        name: "알림 설정",
        onClick: () => {},
        modeFlags: undefined,
        isImportant: false,
    },
    {
        name: "소유권 양도",
        onClick: () => {},
        modeFlags: ChatMemberModeFlags.ADMIN,
        isImportant: false,
    },
    {
        name: "매니저 지정",
        onClick: () => {},
        modeFlags: ChatMemberModeFlags.ADMIN /* | ChatMemberModeFlags.MANAGER*/, //NOTE: 매니저는 매니저를 지정할 수 없어야 함.
        isImportant: false,
    },
    {
        name: "채팅방 삭제",
        onClick: () => {},
        modeFlags: ChatMemberModeFlags.ADMIN,
        isImportant: true,
    },
    {
        name: "방 나가기",
        onClick: () => {},
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
    return (
        <div
            className={`${className} flex-col items-center text-base font-bold text-gray-100/80`}
        >
            {chatRoomHeaderMenus
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
                                menu.isImportant ? "hover:bg-red-500/80" : ""
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
