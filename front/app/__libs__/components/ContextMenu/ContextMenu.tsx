import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ContextMenuBase } from "./ContextMenuBase";
import { ByteBuffer } from "@akasha-lib";
import { useAtomValue } from "jotai";
import { TargetedAccountUUIDAtom } from "@atoms/AccountAtom";
import { ChatServerOpcode } from "@common/chat-opcodes";
import { usePublicProfile } from "@hooks/useProfile";
import { useEffect, useRef } from "react";
import { ActiveStatus, getActiveStatusNumber } from "@common/generated/types";
import { FriendModifyFlags } from "@common/chat-payloads";
import { logoutAction } from "@/app/(main)/@home/(nav)/logoutAction";

export type Relationship = "myself" | "friend" | "stranger";

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
    | "addenemy";
// | "reportuser";

type ProfileMenu = {
    name: string;
    description?: string | undefined;
    action?: ProfileMenuActions | undefined;
    relation: Relationship[];
    isImportant: boolean;
    className: string;
};

const profileMenus: ProfileMenu[] = [
    {
        name: "태그 복사",
        action: "copytag",
        relation: ["myself", "friend", "stranger"],
        isImportant: false,
        className: "",
    },
    {
        name: "내 상태 변경",
        action: "changeactivestatus",
        relation: ["myself"],
        isImportant: false,
        className: "",
    },
    // {
    //     name: "내 정보 수정",
    //     action: "editmyprofile",
    //     relation: ["myself"],
    //     isImportant: false,
    //     className: "",
    // },
    {
        name: "로그아웃",
        action: "logout",
        relation: ["myself"],
        isImportant: false,
        className: "",
    },
    {
        name: "상세 프로필",
        action: "gotoprofile",
        relation: ["myself", "friend", "stranger"],
        isImportant: false,
        className: "",
    },
    {
        name: "친구 추가",
        action: "addfriend",
        relation: ["stranger"],
        isImportant: false,
        className: "",
    },
    {
        name: "친구 그룹 변경",
        action: "modifyfriend",
        relation: ["friend"],
        isImportant: false,
        className: "",
    },
    {
        name: "친구 삭제",
        action: "deletefriend",
        relation: ["friend"],
        isImportant: true,
        className: "hover:bg-red-500/30",
    },
    // {
    //     name: "사용자 신고",
    //     action: "reportuser",
    //     relation: ["friend", "stranger"],
    //     isImportant: true,
    //     className: "hover:bg-red-500/30",
    // },
    {
        name: "사용자 차단",
        action: "addenemy",
        relation: ["friend", "stranger"],
        isImportant: true,
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
        <button
            type="button"
            ref={ref}
            disabled={disabled}
            className={`relative flex h-fit w-full items-center rounded py-3 ${
                menuInfo.isImportant
                    ? "hover:bg-red-500/30"
                    : "hover:bg-primary/30"
            } ${!disabled && "active:bg-secondary/80"}`}
        >
            <div className="relative flex w-full flex-col justify-center px-4 py-1">
                <div className="select-none">{menuInfo.name}</div>
                {menuInfo.description !== undefined && (
                    <div className="select-none text-base text-purple-900">
                        {menuInfo.description}
                    </div>
                )}
            </div>
        </button>
    );
}

// TODO: disabled 와 아예 안보이는 메뉴 차이?
export function ContextMenu({ type }: { type: Relationship }) {
    const accountUUID = useAtomValue(TargetedAccountUUIDAtom);
    // TODO: profile undefined 면 뭘 어떻게 해야??
    const profile = usePublicProfile(accountUUID);
    const { sendPayload } = useWebSocket("chat", []);

    // TODO: 이거 fallback 처리를 여기서 하는게 맞는가,
    // 아니면 각각 action 함수 내부마다 따로 하나씩 해주는게 맞는가
    const nickName = profile?.nickName ?? "fallback";
    const nickTag = profile?.nickTag ?? 0;

    //TODO: fetch score
    const score = 1321;

    const rating: ProfileMenu = {
        name: `rating: ${score}`,
        relation: ["myself", "friend", "stranger"],
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
            const modifyFlags = 1; // TODO: 이거 값 받기
            const buf = ByteBuffer.createWithOpcode(
                ChatServerOpcode.MODIFY_FRIEND,
            );
            buf.writeUUID(accountUUID);
            buf.write1(modifyFlags);
            if ((modifyFlags & FriendModifyFlags.MODIFY_GROUP_NAME) !== 0) {
                const groupName = "새 그룹 1";
                buf.writeString(groupName);
            }
            if ((modifyFlags & FriendModifyFlags.MODIFY_ACTIVE_FLAGS) !== 0) {
                const activeFlags = 1; // TODO: 값 받기
                buf.write1(activeFlags);
            }

            sendPayload(buf);
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
        // ["reportuser"]: () => {},
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
                .filter((menu) => menu.relation.includes(type))
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
