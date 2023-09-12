import {
    makeActiveStatusManualRequest,
    makeAddEnemyRequest,
    makeAddFriendRequest,
    makeChangeMemberRoleRequest,
    makeDeleteFriendRequest,
    makeHandoverRoomOwnerRequest,
} from "@akasha-utils/chat-payload-builder-client";
import { makeDirectChatKey } from "@akasha-utils/idb/chat-store";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import {
    ChatModalOpenAtom,
    ChatTabIndexAtom,
    CurrentChatRoomUUIDAtom,
    RightSideBarIsOpenAtom,
} from "@atoms/ChatAtom";
import { FriendModalIsOpen } from "@atoms/FriendAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import {
    ActiveStatus,
    RoleNumber,
    getActiveStatusNumber,
} from "@common/generated/types";
import type { AccountProfileProtectedPayload } from "@common/profile-payloads";
import {
    useChatMember,
    useSetChatRightSideBarCurrrentPageAtom,
} from "@hooks/useChatRoom";
import { useSetAtom } from "jotai";
import { useMemo } from "react";
import { logoutAction } from "./logoutAction";

export function useContextMenuActions(
    targetAccountUUID: string,
    currentAccountUUID: string,
    currentChatRoomUUID: string,
    profile: AccountProfileProtectedPayload | undefined,
) {
    // TODO: profile undefined 면 뭘 어떻게 해야??
    const { sendPayload } = useWebSocket("chat", []);
    const setCurrentPage = useSetChatRightSideBarCurrrentPageAtom();
    const targetUser = useChatMember(currentChatRoomUUID, targetAccountUUID);
    const targetRoleLevel = Number(targetUser?.role ?? 0);

    const setCurrentChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom, {
        store: GlobalStore,
    });

    // TODO: 이거 fallback 처리를 여기서 하는게 맞는가,
    // 아니면 각각 action 함수 내부마다 따로 하나씩 해주는게 맞는가
    const nickName = profile?.nickName ?? "fallback";
    const nickTag = profile?.nickTag ?? 0;
    const setChatModalIsOpen = useSetAtom(ChatModalOpenAtom, {
        store: GlobalStore,
    });
    const setChatTabIndex = useSetAtom(ChatTabIndexAtom, {
        store: GlobalStore,
    });
    const setFriendModalIsOpen = useSetAtom(FriendModalIsOpen, {
        store: GlobalStore,
    });
    const setRightsideBarIsOpen = useSetAtom(RightSideBarIsOpenAtom, {
        store: GlobalStore,
    });

    const actions = useMemo(
        () => ({
            ["copytag"]: () => {
                // TODO: 복사되었다고 텍스트 바꾸기? setTimeout?
                navigator.clipboard
                    .writeText(`${nickName}#${nickTag}`)
                    .then(() => {})
                    .catch(() => {});
            },
            ["changeactivestatus"]: () => {
                // TODO: 입력으로 받기
                const newActiveStatus = ActiveStatus.INVISIBLE;
                const buf = makeActiveStatusManualRequest(
                    getActiveStatusNumber(newActiveStatus),
                );
                sendPayload(buf);
            },
            ["addfriend"]: () => {
                const buf = makeAddFriendRequest(
                    targetAccountUUID,
                    "",
                    0b11111111,
                );
                sendPayload(buf);
            },
            ["logout"]: () => {
                logoutAction();
            },
            ["gotoprofile"]: () => {
                window.open(`/profile/${nickName}/${nickTag}`);
            },
            ["addenemy"]: () => {
                if (
                    confirm(
                        `진짜로 정말로 [${nickName}]님을 차단하실건가요...?`,
                    )
                ) {
                    sendPayload(makeAddEnemyRequest(targetAccountUUID, ""));
                }
            },
            ["reportuser"]: () => {
                setCurrentPage("report");
            },
            ["directmessage"]: () => {
                setRightsideBarIsOpen(false);
                setFriendModalIsOpen(false);
                setChatModalIsOpen(true);
                setChatTabIndex(1);
                setCurrentChatRoomUUID(
                    makeDirectChatKey(currentAccountUUID, targetAccountUUID),
                );
            },
            ["accessban"]: () => {
                setCurrentPage("newAccessBan");
            },
            ["sendban"]: () => {
                setCurrentPage("newSendBan");
            },
            ["transfer"]: () => {
                if (confirm("정말로 방을 양도하시겠습니까?")) {
                    sendPayload(
                        makeHandoverRoomOwnerRequest(
                            currentChatRoomUUID,
                            targetAccountUUID,
                        ),
                    );
                }
            },
            ["changerole"]: () => {
                if (targetRoleLevel === (RoleNumber.USER as number)) {
                    if (confirm("매니저로 임명하시겠습니까?")) {
                        const targetRole = RoleNumber.MANAGER;
                        sendPayload(
                            makeChangeMemberRoleRequest(
                                currentChatRoomUUID,
                                targetAccountUUID,
                                targetRole,
                            ),
                        );
                    }
                } else if (targetRoleLevel === (RoleNumber.MANAGER as number)) {
                    if (confirm("매니저를 해임하시겠습니까?")) {
                        const targetRole = RoleNumber.USER;
                        sendPayload(
                            makeChangeMemberRoleRequest(
                                currentChatRoomUUID,
                                targetAccountUUID,
                                targetRole,
                            ),
                        );
                    }
                }
            },
            ["deletefriend"]: () => {
                if (
                    confirm(
                        `진짜로 정말로 [${nickName}]님을 친구 목록에서 삭제하실건가요...?`,
                    )
                ) {
                    const buf = makeDeleteFriendRequest(targetAccountUUID);
                    sendPayload(buf);
                }
            },
            ["noaction"]: undefined,
        }),
        [
            currentAccountUUID,
            currentChatRoomUUID,
            nickName,
            nickTag,
            sendPayload,
            setChatModalIsOpen,
            setChatTabIndex,
            setCurrentChatRoomUUID,
            setCurrentPage,
            setFriendModalIsOpen,
            setRightsideBarIsOpen,
            targetAccountUUID,
            targetRoleLevel,
        ],
    );
    return actions;
}
