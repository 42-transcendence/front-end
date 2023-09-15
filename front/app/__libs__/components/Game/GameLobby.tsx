"use client";

import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Avatar } from "@components/Avatar";
import { GameMemberAtom, GameRoomPropsAtom } from "@atoms/GameAtom";
import { useAtomValue } from "jotai";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { useCallback, useEffect } from "react";
import { HOST } from "@utils/constants";
import { makeReadyStateRequest } from "@akasha-utils/game-payload-builder-clients";
import { useCopyText } from "@hooks/useCopyText";

export function GameLobby() {
    const currentAccountUUID = useCurrentAccountUUID();
    const members = useAtomValue(GameMemberAtom);
    const gameRoomProps = useAtomValue(GameRoomPropsAtom);
    const [roomCode, setRoomCode, copyRoomCode] = useCopyText({
        onSuccess: "복사 완료!",
        onFailure: "복사 실패",
    });

    const { sendPayload } = useWebSocket("game", []);

    const toggleReady = useCallback(
        (ready: boolean) => {
            sendPayload(makeReadyStateRequest(ready));
        },
        [sendPayload],
    );

    useEffect(() => {
        if (gameRoomProps !== null && gameRoomProps.code !== null) {
            setRoomCode(`https://${HOST}/game/${gameRoomProps.code}`);
        }
    }, [gameRoomProps, setRoomCode]);

    if (gameRoomProps === null) {
        return null;
    }

    return (
        <div>
            <button type="button" onClick={() => copyRoomCode()}>
                방 주소: {roomCode}
            </button>
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
                            onClick={() => toggleReady(!member.ready)}
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
