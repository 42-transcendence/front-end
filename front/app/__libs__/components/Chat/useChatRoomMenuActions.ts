"use client";

import {
    handleChangeRoomPropertyResult,
    handleDestroyRoomResult,
    handleLeaveRoomResult,
} from "@akasha-utils/chat-gateway-client";
import {
    makeChangeRoomPropertyRequest,
    makeDestroyRoomRequest,
    makeLeaveRoomRequest,
} from "@akasha-utils/chat-payload-builder-client";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { handleChatError } from "./handleChatError";
import {
    ChatErrorNumber,
    ChatRoomModeFlags,
    toChatRoomModeFlags,
} from "@common/chat-payloads";
import { digestMessage, encodeUTF8 } from "@akasha-lib";
import { MAX_CHAT_MEMBER_CAPACITY } from "@common/chat-constants";
import { useResetCurrentChatRoomUUID } from "@hooks/useCurrent";
import { useMemo } from "react";
import { useChatRoomModeFlags } from "@hooks/useChatRoom";

export function useChatRoomMenuActions(currentChatRoomUUID: string) {
    const resetCurrentChatRoomUUID = useResetCurrentChatRoomUUID();
    const currentModeFlags = useChatRoomModeFlags(currentChatRoomUUID);

    const { sendPayload } = useWebSocket(
        "chat",
        [
            ChatClientOpcode.CHANGE_ROOM_PROPERTY_RESULT,
            ChatClientOpcode.LEAVE_ROOM_RESULT,
            ChatClientOpcode.DESTROY_ROOM_RESULT,
        ],
        (opcode, buf) => {
            switch (opcode) {
                case ChatClientOpcode.CHANGE_ROOM_PROPERTY_RESULT: {
                    const [errno] = handleChangeRoomPropertyResult(buf);
                    if (errno !== ChatErrorNumber.SUCCESS) {
                        handleChatError(errno);
                    } else {
                        alert("설정을 변경했습니다");
                    }
                    break;
                }
                case ChatClientOpcode.LEAVE_ROOM_RESULT: {
                    const [errno] = handleLeaveRoomResult(buf);
                    if (errno !== ChatErrorNumber.SUCCESS) {
                        handleChatError(errno);
                    } else {
                        resetCurrentChatRoomUUID();
                    }
                    break;
                }
                case ChatClientOpcode.DESTROY_ROOM_RESULT: {
                    const [errno] = handleDestroyRoomResult(buf);
                    if (errno !== ChatErrorNumber.SUCCESS) {
                        handleChatError(errno);
                    } else {
                        resetCurrentChatRoomUUID();
                    }
                    break;
                }
            }
        },
    );

    const actions = useMemo(
        () => ({
            ["changeChatRoomTitle"]: () => {
                const newTitle = prompt("새 채팅방 이름을 입력해주세요");
                if (newTitle !== null) {
                    const buf = makeChangeRoomPropertyRequest(
                        currentChatRoomUUID,
                        newTitle,
                        undefined,
                        undefined,
                        undefined,
                    );
                    sendPayload(buf);
                }
            },
            ["changeChatRoomVisibility"]: () => {
                const sendChangeRoomRequestAsync = () => {
                    if (currentModeFlags === undefined) {
                        return;
                    }

                    const isPrivate =
                        (currentModeFlags & ChatRoomModeFlags.PRIVATE) !== 0;
                    const isSecret =
                        (currentModeFlags & ChatRoomModeFlags.SECRET) !== 0;
                    const text = isPrivate
                        ? "공개 방으로 전환하실건가요?"
                        : "비공개 방으로 전환하실건가요?";
                    if (!confirm(text)) {
                        return;
                    }

                    const modeFlags = toChatRoomModeFlags({
                        isPrivate: !isPrivate,
                        isSecret: isSecret,
                    });
                    const buf = makeChangeRoomPropertyRequest(
                        currentChatRoomUUID,
                        undefined,
                        modeFlags,
                        undefined,
                        undefined,
                    );
                    sendPayload(buf);
                };
                sendChangeRoomRequestAsync();
            },
            ["changeChatRoomPassword"]: () => {
                const sendChangeRoomRequestAsync = async () => {
                    if (currentModeFlags === undefined) {
                        return;
                    }

                    const isPrivate =
                        (currentModeFlags & ChatRoomModeFlags.PRIVATE) !== 0;
                    const isSecret =
                        (currentModeFlags & ChatRoomModeFlags.SECRET) !== 0;

                    let password = "";
                    const isSecretNew = confirm("비밀번호를 사용하실건가요?");

                    if (!isSecret && !isSecretNew) {
                        return;
                    }

                    if (isSecretNew) {
                        const passwordRaw =
                            prompt("사용할 비밀번호를 입력해주세요");
                        if (passwordRaw === null) {
                            alert("원래 설정을 유지합니다");
                            return;
                        }
                        password = btoa(
                            String.fromCharCode(
                                ...(await digestMessage(
                                    "SHA-256",
                                    encodeUTF8(passwordRaw),
                                )),
                            ),
                        );
                    }
                    const modeFlags = toChatRoomModeFlags({
                        isPrivate: isPrivate,
                        isSecret: isSecretNew,
                    });
                    const buf = makeChangeRoomPropertyRequest(
                        currentChatRoomUUID,
                        undefined,
                        modeFlags,
                        isSecretNew ? password : undefined,
                        undefined,
                    );
                    sendPayload(buf);
                };
                sendChangeRoomRequestAsync().catch(() => {});
            },
            ["changeChatRoomLimit"]: () => {
                const newLimitStr = prompt(
                    `새 인원제한을 입력해주세요: 1 ~ ${MAX_CHAT_MEMBER_CAPACITY}`,
                );
                if (newLimitStr === null) {
                    alert("원래 설정을 유지합니다");
                    return;
                }
                const newLimit = Number(newLimitStr);
                if (
                    Number.isSafeInteger(newLimit) &&
                    newLimit > 0 &&
                    newLimit < MAX_CHAT_MEMBER_CAPACITY
                ) {
                    const buf = makeChangeRoomPropertyRequest(
                        currentChatRoomUUID,
                        undefined,
                        undefined,
                        undefined,
                        newLimit,
                    );
                    sendPayload(buf);
                } else {
                    alert("올바른 숫자를 입력해 주세요");
                }
            },
            ["delete"]: () => {
                if (confirm("정말 채팅방을 삭제하시겠습니까?")) {
                    const buf = makeDestroyRoomRequest(currentChatRoomUUID);
                    sendPayload(buf);
                }
            },
            ["leave"]: () => {
                if (confirm("정말 채팅방을 나가시겠습니까?")) {
                    const buf = makeLeaveRoomRequest(currentChatRoomUUID);
                    sendPayload(buf);
                }
            },
        }),
        [currentChatRoomUUID, currentModeFlags, sendPayload],
    );

    return actions;
}
