import { EnemyEntryListAtom, FriendEntryListAtom } from "@atoms/FriendAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { RoleNumber } from "@common/generated/types";
import { useChatMember } from "@hooks/useChatRoom";
import { useAtomValue } from "jotai";

export type Relationship = "myself" | "friend" | "stranger";
export type Scope = "ChatRoom" | "FriendModal" | "Navigation";

type ProfileMenuActions =
    | "copytag"
    | "changeactivestatus"
    | "addfriend"
    | "deletefriend"
    | "directmessage"
    | "logout"
    | "gotoprofile"
    | "addenemy"
    | "deleteenemy"
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

export function useContextMenus(
    targetAccountUUID: string,
    currentChatRoomUUID: string,
) {
    const targetUser = useChatMember(currentChatRoomUUID, targetAccountUUID);
    const targetRoleLevel = Number(targetUser?.role ?? 0);
    const friendEntryList = useAtomValue(FriendEntryListAtom, {
        store: GlobalStore,
    });

    const enemyEntryList = useAtomValue(EnemyEntryListAtom, {
        store: GlobalStore,
    });

    const isFriend =
        friendEntryList.find((e) => e.friendAccountId === targetAccountUUID) !==
        undefined;

    const isEnemy =
        enemyEntryList.find((e) => e.enemyAccountId === targetAccountUUID) !==
        undefined;

    const friendMenu: ProfileMenu = isFriend
        ? {
              name: "친구 삭제",
              action: "deletefriend",
              relation: ["friend", "stranger"],
              isImportant: false,
              minRoleLevel: undefined,
              scope: ["ChatRoom", "FriendModal", "Navigation"],
              className: "",
          }
        : {
              name: "친구 추가",
              action: "addfriend",
              relation: ["stranger"],
              isImportant: false,
              minRoleLevel: undefined,
              scope: ["ChatRoom"],
              className: "",
          };

    const enemyMenu: ProfileMenu = isEnemy
        ? {
              name: "차단 해제",
              action: "deleteenemy",
              relation: ["friend", "stranger"],
              isImportant: false,
              minRoleLevel: undefined,
              scope: ["ChatRoom", "FriendModal", "Navigation"],
              className: "",
          }
        : {
              name: "차단",
              action: "addenemy",
              relation: ["friend", "stranger"],
              isImportant: false,
              minRoleLevel: undefined,
              scope: ["ChatRoom", "FriendModal", "Navigation"],
              className: "",
          };

    const profileMenus: ProfileMenu[] = [
        {
            name: "태그 복사",
            action: "copytag",
            relation: ["myself", "friend", "stranger"],
            isImportant: false,
            minRoleLevel: undefined,
            scope: ["ChatRoom", "FriendModal", "Navigation"],
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
        friendMenu,
        {
            name: "신고",
            action: "reportuser",
            relation: ["friend", "stranger"],
            isImportant: false,
            minRoleLevel: undefined,
            scope: ["ChatRoom"],
            className: "",
        },
        enemyMenu,
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
            name:
                targetRoleLevel !== (RoleNumber.MANAGER as number)
                    ? "매니저 임명"
                    : "매니저 해임",
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
