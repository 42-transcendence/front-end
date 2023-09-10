import type {
    ChatBanSummaryEntry,
    ChatMessageEntry,
    ChatRoomViewEntry,
} from "@common/chat-payloads";
import {
    ChatErrorNumber,
    readChatBanDetail,
    readChatBanSummary,
    readChatMessage,
    readChatRoomView,
} from "@common/chat-payloads";
import type { ByteBuffer } from "@akasha-lib";

// export function handleAddFriendResult(payload: ByteBuffer) {
//     const errno : SocialErrorNumber = payload.read1();
//     if (errno !== SocialErrorNumber.SUCCESS) {
//     } else {
//         const entry = readFriend(payload);
//     }
// }

// export function handleFriendRequest(payload: ByteBuffer) {
//     const accountId = payload.readUUID();
// }

// export function handleModifyFriendResult(payload: ByteBuffer) {
//     const errno : SocialErrorNumber = payload.read1();
//     if (errno !== SocialErrorNumber.SUCCESS) {
//     } else {
//         const targetAccountId = payload.readUUID();
//         const entry = readFriend(payload);
//     }
// }

// export function handleUpdateFriendActiveStatus(payload: ByteBuffer) {
//     const accountId = payload.readUUID();
// }

// export function handleDeleteFriendResult(payload: ByteBuffer) {
//     const errno : SocialErrorNumber = payload.read1();
//     if (errno !== SocialErrorNumber.SUCCESS) {
//     } else {
//         const targetAccountId = payload.readUUID();
//         const half = payload.readBoolean();
//     }
// }

// export function handleAddEnemyResult(payload: ByteBuffer) {
//     const errno : SocialErrorNumber = payload.read1();
//     if (errno !== SocialErrorNumber.SUCCESS) {
//     } else {
//         const entry = readEnemy(payload);
//     }
// }

// export function handleModifyEnemyResult(payload: ByteBuffer) {
//     const errno : SocialErrorNumber = payload.read1();
//     if (errno !== SocialErrorNumber.SUCCESS) {
//     } else {
//         const targetAccountId = payload.readUUID();
//         const entry = readFriend(payload);
//     }
// }

// export function handleDeleteEnemyResult(payload: ByteBuffer) {
//     const errno : SocialErrorNumber = payload.read1();
//     if (errno !== SocialErrorNumber.SUCCESS) {
//     } else {
//         const targetAccountId = payload.readUUID();
//     }
// }

export function handlePublicRoomList(payload: ByteBuffer): ChatRoomViewEntry[] {
    const chatRoomViewList = payload.readArray(readChatRoomView);
    return chatRoomViewList;
}

// export function handleInsertRoom(payload: ByteBuffer) {
//     const room = readChatRoom(payload);
//     const messages = payload.readArray(readChatMessage);
// }

export function handleCreateRoomResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    return [errno, chatId];
}

export function handleEnterRoomResult(
    payload: ByteBuffer,
): [
    errno: ChatErrorNumber,
    chatId: string,
    bans?: ChatBanSummaryEntry[] | undefined,
] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    if (errno === ChatErrorNumber.ERROR_CHAT_BANNED) {
        const bans = payload.readArray(readChatBanSummary);
        return [errno, chatId, bans];
    }
    return [errno, chatId];
}

// export function handleUpdateRoom(payload: ByteBuffer) {
//     const room = readChatRoomView(payload);
// }

// export function handleRemoveRoom(payload: ByteBuffer) {
//     const chatId = payload.readUUID();
// }

export function handleLeaveRoomResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    return [errno, chatId];
}

export function handleInviteRoomResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string, targetAccountId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    const targetAccountId = payload.readUUID();
    return [errno, chatId, targetAccountId];
}

// export function handleInsertRoomMember(
//     payload: ByteBuffer,
// ): [chatId: string, member: ChatRoomMemberEntry] {
//     const chatId = payload.readUUID();
//     const member = readChatRoomMember(payload);
//     return [chatId, member];
// }
//
// export function handleUpdateRoomMember(
//     payload: ByteBuffer,
// ): [chatId: string, member: ChatRoomMemberEntry] {
//     const chatId = payload.readUUID();
//     const member = readChatRoomMember(payload);
//     return [chatId, member];
// }

// export function handleRemoveRoomMember(
//     payload: ByteBuffer,
// ): [chatId: string, memberAccountId: string] {
//     const chatId = payload.readUUID();
//     const memberAccountId = payload.readUUID();
//     return [chatId, memberAccountId];
// }

export function handleChatMessagePayload(
    payload: ByteBuffer,
): ChatMessageEntry {
    const message = readChatMessage(payload);
    return message;
}

export function handleSendMessageResult(
    payload: ByteBuffer,
): [
    errno: ChatErrorNumber,
    chatId: string,
    bans?: ChatBanSummaryEntry[] | undefined,
] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    if (errno === ChatErrorNumber.ERROR_CHAT_BANNED) {
        const bans = payload.readArray(readChatBanSummary);
        return [errno, chatId, bans];
    }
    return [errno, chatId];
}

// export function handleSyncCursorPayload(payload: ByteBuffer) {
//     const pair = readChatRoomChatMessagePair(payload);
// }

export function handleChangeRoomPropertyResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    return [errno, chatId];
}

export function handleChangeMemberRoleResult(
    payload: ByteBuffer,
): [
    errno: ChatErrorNumber,
    chatId: string,
    targetAccountId: string,
    targetRole: number,
] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    const targetAccountId = payload.readUUID();
    const targetRole = payload.read1();
    return [errno, chatId, targetAccountId, targetRole];
}

export function handleHandoverRoomOwnerResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string, targetAccountId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    const targetAccountId = payload.readUUID();
    return [errno, chatId, targetAccountId];
}

export function handleKickMemberResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    return [errno, chatId];
}

// export function handleKickNotify(payload: ByteBuffer) {
//     const chatId = payload.readUUID();
//     const ban = readChatBanSummary(payload);
// }

export function handleMuteMemberResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    return [errno, chatId];
}

// export function handleMuteNotify(payload: ByteBuffer) {
//     const chatId = payload.readUUID();
//     const ban = readChatBanSummary(payload);
// }

export function handleBanList(payload: ByteBuffer) {
    const bans = payload.readArray(readChatBanDetail);
    return bans;
}

// banId is nanoId
export function handleUnbanMemberResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, banId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const banId = payload.readString();
    return [errno, banId];
}

export function handleDestroyRoomResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, chatId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const chatId = payload.readUUID();
    return [errno, chatId];
}

// export function handleDirectsList(payload: ByteBuffer) {
//     const targetAccountId = payload.readUUID();
//     const messages = payload.readArray(readChatDirect);
// }

// export function handleChatDirectPayload(payload: ByteBuffer) {
//     const message = readChatDirect(payload);
// }

export function handleSendDirectResult(
    payload: ByteBuffer,
): [errno: ChatErrorNumber, targetAccountId: string] {
    const errno: ChatErrorNumber = payload.read1();
    const targetAccountId = payload.readUUID();
    return [errno, targetAccountId];
}

export function handleReportResult(
    payload: ByteBuffer,
): [errno: ReportErrorNumber, targetAccountId: string] {
    const errno: ReportErrorNumber = payload.read1();
    const targetAccountId = payload.readUUID();
    return [errno, targetAccountId];
}
