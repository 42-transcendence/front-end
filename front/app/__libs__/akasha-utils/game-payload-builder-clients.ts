import { ByteBuffer } from "@akasha-lib";
import { GameServerOpcode } from "@common/game-opcodes";

export function makeReadyStateRequest(ready: boolean) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.READY_STATE);
    buf.writeBoolean(ready);
    return buf;
}

export function makeChangeTeamRequest(team: number) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.CHANGE_TEAM);
    buf.write1(team);
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
