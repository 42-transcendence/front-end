"use client";

import { ChatErrorNumber } from "@common/chat-payloads";

export function handleChatError(errno: ChatErrorNumber) {
    let message = "";
    switch (errno) {
        case ChatErrorNumber.ERROR_NO_ROOM:
            message = "채팅방을 찾을 수 없습니다";
            break;
        case ChatErrorNumber.ERROR_NO_MEMBER:
            message = "멤버를 찾을 수 없습니다";
            break;
        case ChatErrorNumber.ERROR_UNJOINED:
            message = "해당 채팅에 참여중이 아닙니다";
            break;
        case ChatErrorNumber.ERROR_ALREADY_MEMBER:
            message = "이미 참여중인 채팅방입니다";
            break;
        case ChatErrorNumber.ERROR_PERMISSION:
            message = "권한이 없습니다";
            break;
        case ChatErrorNumber.ERROR_RESTRICTED:
            message = "실행할 수 없는 동작입니다";
            break;
        case ChatErrorNumber.ERROR_SELF:
            message = "나에게 할 수 없는 동작입니다";
            break;
        case ChatErrorNumber.ERROR_NOT_FRIEND:
            message = "상대방과 친구가 아닙니다";
            break;
        case ChatErrorNumber.ERROR_ENEMY:
            message = "상대방이 나를 차단했습니다";
            break;
        case ChatErrorNumber.ERROR_CHAT_BANNED:
            message = "정지/차단당한 채팅방입니다";
            break;
        case ChatErrorNumber.ERROR_WRONG_PASSWORD:
            message = "비밀번호가 틀렸습니다";
            break;
        case ChatErrorNumber.ERROR_EXCEED_LIMIT:
            message = "꽉 찬 방입니다";
            break;
        case ChatErrorNumber.ERROR_UNKNOWN:
            message = "알 수 없는 오류로 실패했습니다.";
            break;
        case ChatErrorNumber.ERROR_ACCOUNT_BAN:
            message = "정지된 계정입니다";
            break;
        default:
            break;
    }
    if (message !== "") {
        alert(message);
    }
}
