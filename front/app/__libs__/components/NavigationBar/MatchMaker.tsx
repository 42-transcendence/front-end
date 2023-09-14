"use client";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@akasha-utils/react/websocket-hook";
import { GameClientOpcode, GameServerOpcode } from "@common/game-opcodes";
import { useTimer } from "@hooks/useTimer";
import { useCallback, useMemo, useState } from "react";
import { ByteBuffer } from "../../akasha-lib/library/byte-buffer";
import {
    BattleField,
    GameMatchmakeType,
    GameMode,
    MatchmakeFailedReason,
} from "@common/game-payloads";
import { ACCESS_TOKEN_KEY, HOST } from "@hooks/fetcher";
import { makeMatchmakeHandshakeQueue } from "@common/game-payload-builder-client";
import {
    handleEnqueueAlert,
    handleInvitationPayload,
    handleMatchmakeFailed,
} from "@common/game-gateway-helper-client";

export function MatchMakerPanel() {
    const props = useMemo(
        () => ({
            handshake: () => makeMatchmakeHandshakeQueue().toArray(),
        }),
        [],
    );

    const getURL = useCallback(() => {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
        if (accessToken === null) {
            return "";
        }
        return `wss://${HOST}/game?token=${accessToken}`;
    }, []);
    const [invitation, setInvitation] = useState("");
    const [battleField, setBattleField] = useState<BattleField>();
    const [gameMode, setGameMode] = useState<GameMode>();
    const [limit, setLimit] = useState(0);
    const [fair, setFair] = useState(false);
    const [reason, setReason] = useState<MatchmakeFailedReason>();

    useWebSocketConnector("game", getURL, props);

    const { sendPayload } = useWebSocket(
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
                    break;
                }
                case GameClientOpcode.ENQUEUED: {
                    const [battleField, gameMode, limit, fair] =
                        handleEnqueueAlert(buffer);
                    console.log(battleField, gameMode, limit, fair);
                    setBattleField(battleField);
                    setGameMode(gameMode);
                    setLimit(limit);
                    setFair(fair);
                    break;
                }
                case GameClientOpcode.MATCHMAKE_FAILED: {
                    console.log("here");
                    setReason(handleMatchmakeFailed(buffer));
                    break;
                }
            }
        },
    );

    const timer = useTimer();

    const second = (timer % 60).toString().padStart(2, "0");
    const min = (timer / 60).toFixed();

    return (
        <div className="relative flex flex-col items-start justify-center gap-2 rounded-lg bg-black/30 p-2">
            <div className="flex w-fit shrink-0 rounded">
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
            <span className="text-sm text-gray-300/80">
                게임 찾는 중: {min}:{second}
            </span>
        </div>
    );
}
