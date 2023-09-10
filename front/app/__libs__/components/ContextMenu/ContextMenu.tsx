import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ContextMenuBase } from "./ContextMenuBase";
import { ByteBuffer } from "@akasha-lib";
import { useAtomValue } from "jotai";
import { TargetedAccountUUIDAtom } from "@atoms/AccountAtom";
import { ChatServerOpcode } from "@common/chat-opcodes";
import { useProtectedProfile } from "@hooks/useProfile";
import { useEffect, useRef, useState } from "react";
import {
    ActiveStatus,
    RoleNumber,
    getActiveStatusNumber,
} from "@common/generated/types";
import { logoutAction } from "@/app/(main)/@home/(nav)/logoutAction";
import {
    useChatMember,
    useSetChatRightSideBarCurrrentPageAtom,
} from "@hooks/useChatRoom";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import {
    makeChangeMemberRoleRequest,
    makeHandoverRoomOwnerRequest,
    makeModifyFriendRequest,
} from "@akasha-utils/chat-payload-builder-client";

export type Relationship = "myself" | "friend" | "stranger";

export type Scope = "ChatRoom" | "FriendModal" | "Navigation";

// TODO: 이름 바꾸기
type ProfileMenuActions =
    | "copytag"
    | "changeactivestatus"
    | "addfriend"
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
    scope: Scope | undefined;
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
        name: "친구 추가",
        action: "addfriend",
        relation: ["stranger"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: "ChatRoom",
        className: "",
    },
    {
        name: "친구 그룹 변경",
        action: "modifyfriend",
        relation: ["friend"],
        isImportant: false,
        minRoleLevel: undefined,
        scope: "FriendModal",
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

function FriendGroupForm() {
    return;
}

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
    const accountUUID = useAtomValue(TargetedAccountUUIDAtom);
    const currentId = useCurrentAccountUUID();
    const profile = useProtectedProfile(accountUUID);
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const targetMember = useChatMember(currentChatRoomUUID, accountUUID);
    const roleLevel = Number(targetMember?.role ?? 0);

    const relationship =
        accountUUID === currentId
            ? "myself"
            : profile !== undefined
            ? "friend"
            : "stranger";

    // TODO: profile undefined 면 뭘 어떻게 해야??
    const { sendPayload } = useWebSocket("chat", []);

    // TODO: 이거 fallback 처리를 여기서 하는게 맞는가,
    // 아니면 각각 action 함수 내부마다 따로 하나씩 해주는게 맞는가
    const nickName = profile?.nickName ?? "fallback";
    const nickTag = profile?.nickTag ?? 0;

    //TODO: fetch score
    const score = 1321;
    const setCurrentPage = useSetChatRightSideBarCurrrentPageAtom();
    const rating: ProfileMenu = {
        name: `rating: ${score}`,
        relation: ["myself", "friend", "stranger"],
        scope: "ChatRoom",
        isImportant: false,
        className: "hover:bg-transparent active:bg-transparent",
    };

    const actions = {
        ["copytag"]: () => {
            // TODO: 복사되었다고 텍스트 바꾸기? setTimeout?
            navigator.clipboard
                .writeText(`${nickName}#${nickTag}`)
                .then(() => {})
                .catch(() => {});
        },
        ["changeactivestatus"]: () => {
            // TODO: 입력으로 받기
            const newActiveStatus = ActiveStatus.ONLINE;
            const buf = ByteBuffer.createWithOpcode(
                ChatServerOpcode.ACTIVE_STATUS_MANUAL,
            );
            buf.write1(getActiveStatusNumber(newActiveStatus));
            sendPayload(buf);
        },
        ["addfriend"]: () => {
            // TODO: true: add friend by nick + tag, false: by id
            const buf = ByteBuffer.createWithOpcode(
                ChatServerOpcode.ADD_FRIEND,
            );

            // 어차피 해당 컴포넌트 내에서 TargetedAccountUUIDAtom 있으므로
            // lookup 필요하게 nick + tag로 보내줄 필요 없음
            const lookup = false;
            buf.writeBoolean(lookup);
            buf.writeUUID(accountUUID);

            sendPayload(buf);
        },
        // ["editmyprofile"]: () => {
        // },
        ["modifyfriend"]: () => {
            sendPayload(makeModifyFriendRequest(accountUUID));
        },
        ["logout"]: () => {
            // TODO: 현재 이 함수 (nav)폴더에 있는데 어디로 옮기지? util? 아니면 여기 이 폴더?
            logoutAction();
        },
        ["gotoprofile"]: () => {
            window.open(`/profile/${nickName}/${nickTag}`);
        },
        ["addenemy"]: () => {
            if (confirm(`진짜로 정말로 [${nickName}]님을 차단하실건가요...?`)) {
                const buf = ByteBuffer.createWithOpcode(
                    ChatServerOpcode.ADD_ENEMY,
                );
                buf.writeUUID(accountUUID);
                sendPayload(buf);
            }
        },
        ["reportuser"]: () => {
            setCurrentPage("report");
        },
        ["accessban"]: () => {
            setCurrentPage("newAccessBan");
        },
        ["sendban"]: () => {
            setCurrentPage("newSendBan");
        },
        ["transfer"]: () => {
            if (confirm("정말로 방을 양도하시겠습니까ㅏ?")) {
                const targetAccountId = "asdf";
                const buf = makeHandoverRoomOwnerRequest(
                    currentChatRoomUUID,
                    targetAccountId,
                );
                sendPayload(buf);
            }
        },
        ["grant"]: () => {
            if (confirm("매니저 지정하시겠습니까?")) {
                const targetAccountId = "asdf";
                const targetRole = RoleNumber.MANAGER;
                const buf = makeChangeMemberRoleRequest(
                    currentChatRoomUUID,
                    targetAccountId,
                    targetRole,
                );
                sendPayload(buf);
            }
        },
        ["deletefriend"]: () => {
            if (
                confirm(
                    `진짜로 정말로 [${nickName}]님을 친구 목록에서 삭제하실건가요...?`,
                )
            ) {
                const buf = ByteBuffer.createWithOpcode(
                    ChatServerOpcode.DELETE_FRIEND,
                );
                buf.writeUUID(accountUUID);
                sendPayload(buf);
            }
        },
    };

    return (
        <ContextMenuBase className="w-full">
            {[rating, ...profileMenus]
                .filter((menu) => {
                    if (menu.scope !== undefined && menu.scope !== type) {
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
