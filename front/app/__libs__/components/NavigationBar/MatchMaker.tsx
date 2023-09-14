"use client";

import {
    useWebSocket,
    useWebSocketConnector,
} from "@akasha-utils/react/websocket-hook";
import { GameClientOpcode } from "@common/game-opcodes";
import { useTimer } from "@hooks/useTimer";
import { useCallback, useMemo, useState } from "react";
import { makeMatchmakeHandshakeQueue } from "@common/game-payload-builder-client";
import {
    handleEnqueueAlert,
    handleInvitationPayload,
    handleMatchmakeFailed,
} from "@common/game-gateway-helper-client";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { InvitationAtom, MatchMakingAtom } from "@atoms/GameAtom";
import { ACCESS_TOKEN_KEY, HOST } from "@utils/constants";
import { BattleField, GameMode } from "@common/game-payloads";

export function MatchMakerWrapper() {
    const isMatchMaking = useAtomValue(MatchMakingAtom);

    return <>{isMatchMaking ? <MatchMakerPanel /> : null}</>;
}

function MatchMakerPanel() {
    const props = useMemo(
        () => ({
            handshake: () => makeMatchmakeHandshakeQueue().toArray(),
        }),
        [],
    );
    const router = useRouter();

    const getURL = useCallback(() => {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            return "";
        }
        return `wss://${HOST}/game?token=${accessToken}`;
    }, []);
    const setInvitation = useSetAtom(InvitationAtom);
    const setMatchMaking = useSetAtom(MatchMakingAtom);
    const [battleField, setBattleField] = useState<BattleField>();
    const [gameMode, setGameMode] = useState<GameMode>();
    const [limit, setLimit] = useState(0);

    useWebSocketConnector("game", getURL, props);

    useWebSocket(
        "game",
        [
            GameClientOpcode.INVITATION,
            GameClientOpcode.ENQUEUED,
            GameClientOpcode.MATCHMAKE_FAILED,
        ],
        (opcode, buffer) => {
            switch (opcode) {
                case GameClientOpcode.INVITATION: {
                    setInvitation(handleInvitationPayload(buffer));
                    router.push("/game");
                    break;
                }
                case GameClientOpcode.ENQUEUED: {
                    const [battleField, gameMode, limit] =
                        handleEnqueueAlert(buffer);
                    setBattleField(battleField);
                    setGameMode(gameMode);
                    setLimit(limit);
                    break;
                }
                case GameClientOpcode.MATCHMAKE_FAILED: {
                    alert(
                        "매칭에 실패했습니다.\n사유:" +
                            handleMatchmakeFailed(buffer),
                    );
                    break;
                }
            }
        },
    );

    const cancelMatchMaking = () => setMatchMaking(false);

    const timer = useTimer();
    const second = (timer % 60).toString().padStart(2, "0");
    const min = (timer / 60).toFixed();

    return (
        <div className="relative flex flex-row items-center justify-center gap-1 rounded-lg bg-black/30 p-2">
            <div className="flex w-fit shrink-0 overflow-clip rounded">
                <span className="w-fit shrink-0 bg-windowGlass/30 px-1 py-0.5 text-sm font-bold">
                    {limit === 2 ? "1:1" : "2:2"}
                </span>
                <span className="w-fit shrink-0 bg-windowGlass/30 px-1 py-0.5 text-sm font-bold">
                    {battleField === BattleField.ROUND
                        ? "동글동글"
                        : battleField === BattleField.SQUARE
                        ? "네모네모"
                        : "두근두근"}
                </span>
                <span
                    className={`w-fit shrink-0 ${
                        gameMode === GameMode.UNIFORM
                            ? "bg-secondary/70"
                            : "bg-primary/70"
                    } px-1 py-0.5 text-sm font-bold `}
                >
                    {gameMode === GameMode.UNIFORM
                        ? "기본"
                        : gameMode === GameMode.GRAVITY
                        ? "중력"
                        : "두근"}
                </span>
            </div>
            <span className="relative flex w-full justify-center rounded-lg px-1 py-0.5 text-base text-gray-100/80">
                {min}:{second}
            </span>
            <button type="button" onClick={cancelMatchMaking}>
                매칭취소
            </button>
        </div>
    );
}
