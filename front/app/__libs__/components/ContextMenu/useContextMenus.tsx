import { RoleNumber } from "@common/generated/types";

export type Relationship = "myself" | "friend" | "stranger";
export type Scope = "ChatRoom" | "FriendModal" | "Navigation";

type ProfileMenuActions =
    | "copytag"
    | "changeactivestatus"
    | "addfriend"
    | "directmessage"
    | "logout"
    | "deletefriend"
    | "gotoprofile"
    | "addenemy"
    | "accessban"
    | "sendban"
    | "reportuser"
    | "transfer"
    | "changerole"
    | "noaction";

export type ProfileMenu = {
    name: string;
    description?: string | undefined;
    action: ProfileMenuActions;
    relation: Relationship[];
    isImportant: boolean;
    minRoleLevel?: number | undefined;
    scope: Scope[];
    className: string;
    UI?: React.ReactNode | undefined;
};

export function useContextMenus() {
    const profileMenus: ProfileMenu[] = [
        {
            name: "태그 복사",
            action: "copytag",
            relation: ["myself", "friend", "stranger"],
            isImportant: false,
            minRoleLevel: undefined,
            scope: ["ChatRoom"],
            className: "",
        },
        {
            name: "내 상태 변경",
            action: "changeactivestatus",
            relation: ["myself"],
            isImportant: false,
            minRoleLevel: undefined,
            scope: ["Navigation"],
            className: "",
        },
        {
            name: "로그아웃",
            action: "logout",
            relation: ["myself"],
            isImportant: false,
            minRoleLevel: undefined,
            scope: ["Navigation"],
            className: "",
        },
        {
            name: "상세 프로필",
            action: "gotoprofile",
            relation: ["myself", "friend", "stranger"],
            isImportant: false,
            minRoleLevel: undefined,
            scope: ["ChatRoom", "FriendModal", "Navigation"],
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
            scope: ["ChatRoom"],
            className: "",
        },
        {
            name: "친구 삭제",
            action: "deletefriend",
            relation: ["friend"],
            isImportant: true,
            minRoleLevel: undefined,
            scope: ["ChatRoom", "FriendModal", "Navigation"],
            className: "hover:bg-red-500/30",
        },
        {
            name: "신고",
            action: "reportuser",
            relation: ["friend", "stranger"],
            isImportant: true,
            minRoleLevel: undefined,
            scope: ["ChatRoom"],
            className: "hover:bg-red-500/30",
        },
        {
            name: "차단",
            action: "addenemy",
            relation: ["friend", "stranger"],
            isImportant: false,
            minRoleLevel: undefined,
            scope: ["ChatRoom", "FriendModal", "Navigation"],
            className: "hover:bg-tertiary/30",
        },
        {
            name: "채팅 금지",
            action: "sendban",
            relation: ["friend", "stranger"],
            isImportant: true,
            minRoleLevel: RoleNumber.MANAGER,
            scope: ["ChatRoom"],
            className: "hover:bg-tertiary/30",
        },
        {
            name: "추방",
            action: "accessban",
            relation: ["friend", "stranger"],
            isImportant: true,
            minRoleLevel: RoleNumber.MANAGER,
            scope: ["ChatRoom"],
            className: "hover:bg-tertiary/30",
        },
        {
            name: "소유권 양도",
            action: "transfer",
            relation: ["friend", "stranger"],
            minRoleLevel: RoleNumber.ADMINISTRATOR,
            isImportant: true,
            scope: ["ChatRoom"],
            className: "hover:bg-red-500/30",
        },
        {
            name: "매니저 임명/해임",
            action: "changerole",
            relation: ["friend", "stranger"],
            minRoleLevel: RoleNumber.ADMINISTRATOR,
            isImportant: true,
            scope: ["ChatRoom"],
            className: "hover:bg-red-500/30",
        },
    ];
    return profileMenus;
}
