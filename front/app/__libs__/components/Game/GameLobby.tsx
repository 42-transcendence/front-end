"use client";

import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Avatar } from "@components/Avatar";
import { GameMemberAtom, GameRoomPropsAtom } from "@atoms/GameAtom";
import { useAtomValue } from "jotai";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { useCallback, useEffect, useState } from "react";
import { HOST } from "@utils/constants";
import { makeUpdateMemberRequest } from "@akasha-utils/game-payload-builder-clients";

export function GameLobby() {
    const currentAccountUUID = useCurrentAccountUUID();
    const members = useAtomValue(GameMemberAtom);
    const gameRoomProps = useAtomValue(GameRoomPropsAtom);
    const [roomCode, setRoomCode] = useState("");

    const { sendPayload } = useWebSocket("game", []);

    const toggleReady = useCallback(() => {
        sendPayload(makeUpdateMemberRequest(true));
    }, [sendPayload]);

    useEffect(() => {
        if (gameRoomProps !== null && gameRoomProps.code !== null) {
            setRoomCode(gameRoomProps.code);
        }
    }, [gameRoomProps]);

    const copyGameRoomCode = useCallback(() => {
        if (gameRoomProps === null) {
            return;
        }

        const code = gameRoomProps.code;
        if (code === null) {
            alert("빠른 대전은 방 공유가 불가능합니다");
            return;
        }

        navigator.clipboard
            .writeText(`https://${HOST}/game/${code}`)
            .then(() => setRoomCode("복사 완료!"))
            .catch(() => setRoomCode("복사 실패"));

        setTimeout(() => setRoomCode(code), 1000);
    }, [gameRoomProps]);

    if (gameRoomProps === null) {
        return null;
    }

    return (
        <div>
            <button type="button" onClick={() => copyGameRoomCode()}>
                방 코드: {roomCode}
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
