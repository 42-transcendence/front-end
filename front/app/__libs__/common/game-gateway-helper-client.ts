import type { ByteBuffer } from "@akasha-lib";
import type {
    BattleField,
    GameMemberParams,
    GameMode,
    GameRoomEnterResult,
    GameRoomParams,
    GameRoomProps,
    MatchmakeFailedReason,
} from "./game-payloads";
import {
    readGameRoomProps,
    readGameRoomParams,
    readGameMemberParams,
} from "./game-payloads";

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
    let members: GameMemberParams[] = [];
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

export function handleEnterMember(
    payload: ByteBuffer,
): [
    accountId: string,
    character: number,
    specification: number,
    team: number,
    ready: boolean,
] {
    const accountId = payload.readUUID();
    const character = payload.read1();
    const specification = payload.read1();
    const team = payload.read1();
    const ready = payload.readBoolean();
    return [accountId, character, specification, team, ready];
}

export function handleUpdateMember(
    payload: ByteBuffer,
): [
    accountId: string,
    character: number,
    specification: number,
    team: number,
    ready: boolean,
] {
    const accountId = payload.readUUID();
    const character = payload.read1();
    const specification = payload.read1();
    const team = payload.read1();
    const ready = payload.readBoolean();
    return [accountId, character, specification, team, ready];
}

export function handleLeaveMember(payload: ByteBuffer): string {
    const accountId = payload.readUUID();
    return accountId;
}
