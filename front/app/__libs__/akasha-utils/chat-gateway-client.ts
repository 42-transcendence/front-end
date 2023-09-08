import {
    ChatErrorNumber,
    SocialErrorNumber,
    readChatBanDetail,
    readChatBanSummary,
    readChatDirect,
    readChatMessage,
    readChatRoom,
    readChatRoomChatMessagePair,
    readChatRoomMember,
    readChatRoomView,
    readEnemy,
    readFriend,
} from "@common/chat-payloads";
import type { ByteBuffer } from "@akasha-lib";

export function handleAddFriendResult(payload: ByteBuffer) {
    const errno = payload.read1();
    if (errno !== SocialErrorNumber.SUCCESS) {
    } else {
        const entry = readFriend(payload);
    }
}

export function handleFriendRequest(payload: ByteBuffer) {
    const accountId = payload.readUUID();
}

export function handleModifyFriendResult(payload: ByteBuffer) {
    const errno = payload.read1();
    if (errno !== SocialErrorNumber.SUCCESS) {
    } else {
        const targetAccountId = payload.readUUID();
        const entry = readFriend(payload);
    }
}

export function handleUpdateFriendActiveStatus(payload: ByteBuffer) {
    const accountId = payload.readUUID();
}

export function handleDeleteFriendResult(payload: ByteBuffer) {
    const errno = payload.read1();
    if (errno !== SocialErrorNumber.SUCCESS) {
    } else {
        const targetAccountId = payload.readUUID();
        const half = payload.readBoolean();
    }
}

export function handleAddEnemyResult(payload: ByteBuffer) {
    const errno = payload.read1();
    if (errno !== SocialErrorNumber.SUCCESS) {
    } else {
        const entry = readEnemy(payload);
    }
}

export function handleModifyEnemyResult(payload: ByteBuffer) {
    const errno = payload.read1();
    if (errno !== SocialErrorNumber.SUCCESS) {
    } else {
        const targetAccountId = payload.readUUID();
        const entry = readFriend(payload);
    }
}

export function handleDeleteEnemyResult(payload: ByteBuffer) {
    const errno = payload.read1();
    if (errno !== SocialErrorNumber.SUCCESS) {
    } else {
        const targetAccountId = payload.readUUID();
    }
}

export function handlePublicRoomList(payload: ByteBuffer) {
    const chatRoomViewList = payload.readArray(readChatRoomView);
}

export function handleInsertRoom(payload: ByteBuffer) {
    const room = readChatRoom(payload);
    const messages = payload.readArray(readChatMessage);
}

export function handleCreateRoomResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();
}

export function handleEnterRoomResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();

    if (errno === ChatErrorNumber.ERROR_CHAT_BANNED) {
        const bans = payload.readArray(readChatBanSummary);
    } else if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleUpdateRoom(payload: ByteBuffer) {
    const room = readChatRoomView(payload);
}

export function handleRemoveRoom(payload: ByteBuffer) {
    const chatId = payload.readUUID();
}

export function handleLeaveRoomResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();
}

export function handleInviteRoomResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();
    const targetAccountId = payload.readUUID();
}

export function handleInsertRoomMember(payload: ByteBuffer) {
    const chatId = payload.readUUID();
    const member = readChatRoomMember(payload);
}

export function handleUpdateRoomMember(payload: ByteBuffer) {
    const chatId = payload.readUUID();
    const member = readChatRoomMember(payload);
}

export function handleRemoveRoomMember(payload: ByteBuffer) {
    const chatId = payload.readUUID();
    const memberAccountId = payload.readUUID();
}

export function handleChatMessagePayload(payload: ByteBuffer) {
    const message = readChatMessage(payload);
}

export function handleSendMessageResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();

    if (errno === ChatErrorNumber.ERROR_CHAT_BANNED) {
        const bans = payload.readArray(readChatBanSummary);
    } else if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleSyncCursorPayload(payload: ByteBuffer) {
    const pair = readChatRoomChatMessagePair(payload);
}

export function handleChangeRoomPropertyResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();

    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleChangeMemberRoleResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();
    const targetAccountId = payload.readUUID();
    const targetRole = payload.read1();

    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleHandoverRoomOwnerResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();
    const targetAccountId = payload.readUUID();
    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleKickMemberResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();

    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleKickNotify(payload: ByteBuffer) {
    const chatId = payload.readUUID();
    const ban = readChatBanSummary(payload);
}

export function handleMuteMemberResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();
    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleMuteNotify(payload: ByteBuffer) {
    const chatId = payload.readUUID();
    const ban = readChatBanSummary(payload);
}

export function handleBanList(payload: ByteBuffer) {
    const bans = payload.readArray(readChatBanDetail);
}

export function handleUnbanMemberResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const banId = payload.readString();
    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleDestroyRoomResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const chatId = payload.readUUID();
    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}

export function handleDirectsList(payload: ByteBuffer) {
    const targetAccountId = payload.readUUID();
    const messages = payload.readArray(readChatDirect);
}

export function handleChatDirectPayload(payload: ByteBuffer) {
    const message = readChatDirect(payload);
}

export function handleSendDirectResult(payload: ByteBuffer) {
    const errno = payload.read1();
    const targetAccountId = payload.readUUID();

    if (errno !== ChatErrorNumber.SUCCESS) {
    } else {
    }
}
