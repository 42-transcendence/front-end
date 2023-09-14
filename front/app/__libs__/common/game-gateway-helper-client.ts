import type { ByteBuffer } from "@akasha-lib";
import type {
    BattleField,
    GameMode,
    MatchmakeFailedReason,
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

export function handleGameRoom(payload: ByteBuffer) {
    const id = payload.readUUID();
    const code = payload.readNullable(payload.readString);
    const battleField = payload.read4Unsigned();
    const gameMode = payload.read1();
    const limit = payload.read2();
    const fair = payload.readBoolean();

    const length = payload.readLength();

    let members = [];
    for (let i = 0; i < length; ++i) {
        members.push({
            key: payload.readUUID(),
            val: {
                character: payload.read1(),
                specification: payload.read1(),
                team: payload.read1(),
            },
        });
    }

    const ladder = payload.readBoolean();

    return {
        props: { id, code },
        params: { battleField, gameMode, limit, fair, ladder },
        members,
    };
}

export function handleGameFailedPayload(
    payload: ByteBuffer,
) /* : GameRoomEnterResult */ {
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
