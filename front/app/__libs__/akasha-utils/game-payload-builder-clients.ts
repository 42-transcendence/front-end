import { ByteBuffer } from "@akasha-lib";
import { GameServerOpcode } from "@common/game-opcodes";

export function makeUpdateMemberRequest(ready: boolean) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.READY_STATE);
    buf.writeBoolean(ready);
    return buf;
}
