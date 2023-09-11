import { logoutAction } from "@/app/(main)/@home/(nav)/logoutAction";
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
} from "@atoms/ChatAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import {
    ActiveStatus,
    RoleNumber,
    getActiveStatusNumber,
} from "@common/generated/types";
import type { AccountProfileProtectedPayload } from "@common/profile-payloads";
import { useSetChatRightSideBarCurrrentPageAtom } from "@hooks/useChatRoom";
import { useSetAtom } from "jotai";
import { useMemo } from "react";

export function useContextMenuActions(
    targetAccountUUID: string,
    currentAccountUUID: string,
    currentChatRoomUUID: string,
    profile: AccountProfileProtectedPayload | undefined,
) {
    // TODO: profile undefined 면 뭘 어떻게 해야??
    const { sendPayload } = useWebSocket("chat", []);
    const setCurrentPage = useSetChatRightSideBarCurrrentPageAtom();

    const setCurrentChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom, {
        store: GlobalStore,
    });

    // TODO: 이거 fallback 처리를 여기서 하는게 맞는가,
    // 아니면 각각 action 함수 내부마다 따로 하나씩 해주는게 맞는가
    const nickName = profile?.nickName ?? "fallback";
    const nickTag = profile?.nickTag ?? 0;
    const setChatModalIsOpen = useSetAtom(ChatModalOpenAtom);
    const setChatTabIndex = useSetAtom(ChatTabIndexAtom);

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
                // TODO: true: add friend by nick + tag, false: by id
                const buf = makeAddFriendRequest(targetAccountUUID, "", 255);
                sendPayload(buf);
            },
            // ["editmyprofile"]: () => {
            // },
            ["modifyfriend"]: () => {},
            ["logout"]: () => {
                // TODO: 현재 이 함수 (nav)폴더에 있는데 어디로 옮기지? util? 아니면 여기 이 폴더?
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
                    const reason = prompt("왜요...?") ?? "그냥";
                    const buf = makeAddEnemyRequest(targetAccountUUID, reason);
                    sendPayload(buf);
                }
            },
            ["reportuser"]: () => {
                setCurrentPage("report");
            },
            ["directmessage"]: () => {
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
            ["grant"]: () => {
                if (confirm("매니저 지정하시겠습니까?")) {
                    const targetRole = RoleNumber.MANAGER;
                    sendPayload(
                        makeChangeMemberRoleRequest(
                            currentChatRoomUUID,
                            targetAccountUUID,
                            targetRole,
                        ),
                    );
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
        }),
        [
            currentAccountUUID,
            currentChatRoomUUID,
            nickName,
            nickTag,
            sendPayload,
            setCurrentChatRoomUUID,
            setCurrentPage,
            targetAccountUUID,
        ],
    );
    return actions;
}
