import { ContextMenuBase } from "./ContextMenuBase";
import { useAtomValue } from "jotai";
import { TargetedAccountUUIDAtom } from "@atoms/AccountAtom";
import { useProtectedProfile } from "@hooks/useProfile";
import { useEffect, useRef, useState } from "react";
import { RoleNumber } from "@common/generated/types";
import { useChatMember } from "@hooks/useChatRoom";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import { useContextMenuActions } from "./useContextMenuActions";

export type Relationship = "myself" | "friend" | "stranger";

export type Scope = "ChatRoom" | "FriendModal" | "Navigation";

// TODO: 이름 바꾸기
type ProfileMenuActions =
    | "copytag"
    | "changeactivestatus"
    | "addfriend"
    | "directmessage"
    // | "editmyprofile"
    | "modifyfriend"
    | "logout"
    | "deletefriend"
    | "gotoprofile"
    | "addenemy"
    | "accessban"
    | "sendban"
    | "reportuser"
    | "transfer"
    | "grant";

type ProfileMenu = {
    name: string;
    description?: string | undefined;
    action?: ProfileMenuActions | undefined;
    relation: Relationship[];
    isImportant: boolean;
    minRoleLevel?: number | undefined;
    scope: Scope | Scope[] | undefined;
    className: string;
    UI?: React.ReactNode | undefined;
};

const profileMenus: ProfileMenu[] = [
    {
        name: "태그 복사",
        action: "copytag",
        relation: ["myself", "friend", "stranger"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: "ChatRoom",
        className: "",
    },
    {
        name: "내 상태 변경",
        action: "changeactivestatus",
        relation: ["myself"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: "Navigation",
        className: "",
    },
    {
        name: "로그아웃",
        action: "logout",
        relation: ["myself"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: "Navigation",
        className: "",
    },
    {
        name: "상세 프로필",
        action: "gotoprofile",
        relation: ["myself", "friend", "stranger"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: undefined,
        className: "",
    },
    {
        name: "다이렉트 메시지",
        action: "directmessage",
        relation: ["friend"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: ["ChatRoom", "FriendModal"],
        className: "",
    },
    {
        name: "친구 추가",
        action: "addfriend",
        relation: ["stranger"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: "ChatRoom",
        className: "",
    },
    {
        name: "친구 삭제",
        action: "deletefriend",
        relation: ["friend"],
        isImportant: true,
        minRoleLevel: undefined,
        scope: undefined,
        className: "hover:bg-red-500/30",
    },
    {
        name: "신고",
        action: "reportuser",
        relation: ["friend", "stranger"],
        isImportant: true,
        minRoleLevel: undefined,
        scope: undefined,
        className: "hover:bg-red-500/30",
    },
    {
        name: "차단",
        action: "addenemy",
        relation: ["friend", "stranger"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: undefined,
        className: "hover:bg-tertiary/30",
    },
    {
        name: "채팅 금지",
        action: "sendban",
        relation: ["friend", "stranger"],
        isImportant: true,
        minRoleLevel: RoleNumber.MANAGER,
        scope: "ChatRoom",
        className: "hover:bg-tertiary/30",
    },
    {
        name: "추방",
        action: "accessban",
        relation: ["friend", "stranger"],
        isImportant: true,
        minRoleLevel: RoleNumber.MANAGER,
        scope: "ChatRoom",
        className: "hover:bg-tertiary/30",
    },
    {
        name: "소유권 양도",
        action: "transfer",
        relation: ["friend", "stranger"],
        minRoleLevel: RoleNumber.ADMINISTRATOR,
        isImportant: true,
        scope: "ChatRoom",
        className: "hover:bg-red-500/30",
    },
    {
        name: "매니저 지정",
        action: "grant",
        relation: ["friend", "stranger"],
        minRoleLevel: RoleNumber.ADMINISTRATOR,
        isImportant: true,
        scope: "ChatRoom",
        className: "hover:bg-red-500/30",
    },
];

function ContextMenuItem({
    menuInfo,
    action,
}: {
    menuInfo: ProfileMenu;
    action: (() => void) | undefined;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const disabled = action === undefined;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const elem = ref.current;

        if (elem === null) {
            throw new Error();
        }

        if (action !== undefined) {
            elem.addEventListener("click", action);
        }

        return () => {
            if (action !== undefined) {
                elem.removeEventListener("click", action);
            }
        };
    }, [action]);

    return (
        <>
            <button
                type="button"
                // TODO: onClick 어떻게 하지...?
                onClick={() => setOpen(!open)}
                ref={ref}
                disabled={disabled}
                className={`relative flex h-fit w-full items-center rounded py-3 ${
                    menuInfo.isImportant
                        ? menuInfo.className
                        : "hover:bg-primary/30"
                } ${!disabled && "active:bg-secondary/80"}`}
            >
                <div className="relative flex w-full flex-col justify-center px-4 py-1">
                    <div className="flex select-none justify-start">
                        {menuInfo.name}
                    </div>
                    {menuInfo.description !== undefined && (
                        <div className="select-none text-base text-purple-900">
                            {menuInfo.description}
                        </div>
                    )}
                </div>
            </button>
            {menuInfo.UI ?? (open && menuInfo.UI)}
        </>
    );
}

export function ContextMenu({ type }: { type: Scope }) {
    const targetAccountUUID = useAtomValue(TargetedAccountUUIDAtom);
    const profile = useProtectedProfile(targetAccountUUID);
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const currentAccountUUID = useCurrentAccountUUID();
    const currentUser = useChatMember(currentChatRoomUUID, currentAccountUUID);
    const roleLevel = Number(currentUser?.role ?? 0);
    const actions = useContextMenuActions(
        targetAccountUUID,
        currentAccountUUID,
        currentChatRoomUUID,
        profile,
    );

    const relationship =
        targetAccountUUID === currentAccountUUID
            ? "myself"
            : profile !== undefined
            ? "friend"
            : "stranger";

    //TODO: fetch score
    const score = 1321;
    const rating: ProfileMenu = {
        name: `rating: ${score}`,
        relation: ["myself", "friend", "stranger"],
        scope: "ChatRoom",
        isImportant: false,
        className: "hover:bg-transparent active:bg-transparent",
    };

    return (
        <ContextMenuBase className="w-full">
            {[rating, ...profileMenus]
                .filter((menu) => {
                    if (
                        menu.scope !== undefined &&
                        !menu.scope.includes(type)
                    ) {
                        return;
                    }
                    return (
                        roleLevel >= (menu.minRoleLevel ?? 0) &&
                        menu.relation.includes(relationship)
                    );
                })
                .map((menu) => {
                    return (
                        <ContextMenuItem
                            key={menu.name}
                            menuInfo={menu}
                            action={
                                menu.action !== undefined
                                    ? actions[menu.action]
                                    : undefined
                            }
                        />
                    );
                })}
        </ContextMenuBase>
    );
}
