import { GameServerOpcode } from "@common/game-opcodes";
import type { BattleField, GameMode } from "@common/game-payloads";
import { GameMatchmakeType } from "@common/game-payloads";
import { ByteBuffer } from "@akasha-lib";

export function makeMatchmakeHandshakeQueue() {
    const buf = ByteBuffer.createWithOpcode(
        GameServerOpcode.HANDSHAKE_MATCHMAKE,
    );
    buf.write1(GameMatchmakeType.QUEUE);
    return buf;
}

export function makeMatchmakeHandshakeCreate(
    battleField: BattleField,
    gameMode: GameMode,
    limit: number,
    fair: boolean,
) {
    const buf = ByteBuffer.createWithOpcode(
        GameServerOpcode.HANDSHAKE_MATCHMAKE,
    );
    buf.write1(GameMatchmakeType.CREATE);
    buf.write4Unsigned(battleField);
    buf.write1(gameMode);
    buf.write2Unsigned(limit);
    buf.writeBoolean(fair);
    return buf;
}

export function makeMatchmakeHandshakeEnter(entryCode: string) {
    const buf = ByteBuffer.createWithOpcode(
        GameServerOpcode.HANDSHAKE_MATCHMAKE,
    );
    buf.write1(GameMatchmakeType.ENTER);
    buf.writeString(entryCode);
    return buf;
}

export function makeGameHandshake(invitation: string) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.HANDSHAKE_GAME);
    buf.writeString(invitation);
    return buf;
}

export function makeSelectCharacterRequest(character: number) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.SELECT_CHAR);
    buf.write1(character);
    return buf;
}

export function makeSelectSpecificationRequest(specification: number) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.SELECT_SPEC);
    buf.write1(specification);
    return buf;
}

export function makeChangeTeamRequest(team: number) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.CHANGE_TEAM);
    buf.write1(team);
    return buf;
}

export function makeReadyStateRequest(ready: boolean) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.READY_STATE);
    buf.writeBoolean(ready);
    return buf;
}
