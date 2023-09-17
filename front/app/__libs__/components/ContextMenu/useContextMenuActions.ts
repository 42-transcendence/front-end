import {
    makeAddEnemyRequest,
    makeAddFriendRequest,
    makeChangeMemberRoleRequest,
    makeDeleteEnemyRequest,
    makeDeleteFriendRequest,
    makeHandoverRoomOwnerRequest,
} from "@akasha-utils/chat-payload-builder-client";
import { makeDirectChatKey } from "@akasha-utils/idb/chat-store";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import {
    ChatModalOpenAtom,
    ChatTabIndexAtom,
    CurrentChatRoomUUIDAtom,
    LeftSideBarIsOpenAtom,
    RightSideBarIsOpenAtom,
} from "@atoms/ChatAtom";
import { FriendModalIsOpen } from "@atoms/FriendAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { RoleNumber } from "@common/generated/types";
import type { AccountProfilePublicPayload } from "@common/profile-payloads";
import {
    useChatMember,
    useSetChatRightSideBarCurrrentPageAtom,
} from "@hooks/useChatRoom";
import { useCopyText } from "@hooks/useCopyText";
import { logout } from "@utils/action";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export function useContextMenuActions(
    targetAccountUUID: string,
    currentAccountUUID: string,
    currentChatRoomUUID: string,
    profile: AccountProfilePublicPayload | undefined,
) {
    const { sendPayload } = useWebSocket("chat", []);
    const setCurrentPage = useSetChatRightSideBarCurrrentPageAtom();
    const setLeftsideBarOpen = useSetAtom(LeftSideBarIsOpenAtom, {
        store: GlobalStore,
    });
    const targetUser = useChatMember(currentChatRoomUUID, targetAccountUUID);
    const targetRoleLevel = Number(targetUser?.role ?? 0);

    const router = useRouter();

    const setCurrentChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom, {
        store: GlobalStore,
    });

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

    const [, setText, copyText] = useCopyText(`${nickName}#${nickTag}`);

    useEffect(() => {
        setText(`${nickName}#${nickTag}`);
    }, [nickName, nickTag, setText]);

    const actions = useMemo(
        () => ({
            ["copytag"]: () => {
                copyText();
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
                logout();
            },
            ["gotoprofile"]: () => {
                router.push(`/profile/${nickName}/${nickTag}`);
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
                setLeftsideBarOpen(false);
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
                    sendPayload(makeDeleteFriendRequest(targetAccountUUID));
                }
            },
            ["deleteenemy"]: () => {
                if (confirm(`[${nickName}]님을 차단 해제하시겠습니까?`)) {
                    sendPayload(makeDeleteEnemyRequest(targetAccountUUID));
                }
            },
            ["noaction"]: undefined,
        }),
        [
            copyText,
            currentAccountUUID,
            currentChatRoomUUID,
            nickName,
            nickTag,
            router,
            sendPayload,
            setChatModalIsOpen,
            setChatTabIndex,
            setCurrentChatRoomUUID,
            setCurrentPage,
            setFriendModalIsOpen,
            setLeftsideBarOpen,
            setRightsideBarIsOpen,
            targetAccountUUID,
            targetRoleLevel,
        ],
    );
    return actions;
}
