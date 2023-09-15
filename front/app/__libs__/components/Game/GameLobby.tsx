import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Avatar } from "@components/Avatar";
import { GameMemberAtom, GameRoomPropsAtom } from "@atoms/GameAtom";
import { useAtomValue } from "jotai";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ByteBuffer } from "@akasha-lib";
import { GameServerOpcode } from "@common/game-opcodes";

function makeUpdateMemberRequest(ready: boolean) {
    const buf = ByteBuffer.createWithOpcode(GameServerOpcode.READY_STATE);
    buf.writeBoolean(ready);
    return buf;
}

export function GameLobby() {
    const currentAccountUUID = useCurrentAccountUUID();
    const members = useAtomValue(GameMemberAtom);
    const gameRoomProps = useAtomValue(GameRoomPropsAtom);

    const { sendPayload } = useWebSocket("game", []);

    const toggleReady = () => {
        sendPayload(makeUpdateMemberRequest(true));
    };

    if (gameRoomProps === null) {
        return null;
    }

    return (
        <div>
            {`id: ${gameRoomProps.id} code: ${gameRoomProps.code}`}
            <div className="h-1/2 w-1/2">
                {members.map((member) => (
                    <div
                        key={member.accountId}
                        className={`${
                            member.accountId === currentAccountUUID ? "" : ""
                        }`}
                    >
                        <Avatar
                            accountUUID={member.accountId}
                            className="relative h-12 w-12"
                            privileged={false}
                        />
                        <button
                            className="border-red-400"
                            onClick={toggleReady}
                            disabled={currentAccountUUID !== member.accountId}
                        >
                            {member.ready ? "ready" : "unready"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
