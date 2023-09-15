import type { ByteBuffer } from "@akasha-lib";
import type {
    BattleField,
    GameMemberParams,
    GameMode,
    GameProgress,
    GameRoomEnterResult,
    GameRoomParams,
    GameRoomProps,
    MatchmakeFailedReason,
} from "./game-payloads";
import {
    readGameRoomProps,
    readGameRoomParams,
    readGameMemberParams,
    readGameProgress,
} from "./game-payloads";
import { readFrames } from "./game-physics-payloads";

export function handleEnqueuedAlert(
    payload: ByteBuffer,
): [
    battleField: BattleField,
    gameMode: GameMode,
    limit: number,
    fair: boolean,
] {
    const battleField = payload.read4Unsigned();
    const gameMode = payload.read1();
    const limit = payload.read2();
    const fair = payload.readBoolean();
    return [battleField, gameMode, limit, fair];
}

export function handleInvitationPayload(payload: ByteBuffer): string {
    const invitation = payload.readString();
    return invitation;
}

export function handleMatchmakeFailed(
    payload: ByteBuffer,
): MatchmakeFailedReason {
    const reason = payload.read1();
    return reason;
}

export function handleGameRoom(
    payload: ByteBuffer,
): [
    props: GameRoomProps,
    params: GameRoomParams,
    members: GameMemberParams[],
    ladder: boolean,
] {
    const props = readGameRoomProps(payload);
    const params = readGameRoomParams(payload);

    const length = payload.readLength();
    const members: GameMemberParams[] = [];
    for (let i = 0; i < length; ++i) {
        members.push(readGameMemberParams(payload));
    }

    const ladder = payload.readBoolean();

    return [props, params, members, ladder];
}

export function handleGameFailedPayload(
    payload: ByteBuffer,
): GameRoomEnterResult {
    const errno = payload.read1();
    return errno;
}

export function handleEnterMember(payload: ByteBuffer): GameMemberParams {
    return readGameMemberParams(payload);
}

export function handleUpdateMember(payload: ByteBuffer): GameMemberParams {
    return readGameMemberParams(payload);
}

export function handleLeaveMember(payload: ByteBuffer): string {
    return payload.readUUID();
}

export function handleUpdateGame(payload: ByteBuffer): GameProgress | null {
    return payload.readNullable(readGameProgress);
}

export function handleResyncAll(payload: ByteBuffer) {
    return readFrames(payload);
}

export function handleResyncPart(payload: ByteBuffer) {
    return readFrames(payload);
}
