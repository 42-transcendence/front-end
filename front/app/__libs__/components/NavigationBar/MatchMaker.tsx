"use client";

import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { GameClientOpcode } from "@common/game-opcodes";
import { useTimer } from "@hooks/useTimer";
import { useMemo, useState } from "react";
import { makeMatchmakeHandshakeQueue } from "@common/game-payload-builder-client";
import {
    handleEnqueuedAlert,
    handleMatchmakeFailed,
} from "@common/game-gateway-helper-client";
import { useAtomValue, useSetAtom } from "jotai";
import { IsMatchMakingAtom } from "@atoms/GameAtom";
import { BattleField, GameMode } from "@common/game-payloads";
import { useGameMatchMakeConnector } from "@hooks/useGameWebSocketConnector";

export function MatchMakerWrapper() {
    const isMatchMaking = useAtomValue(IsMatchMakingAtom);

    return <>{isMatchMaking ? <MatchMakerPanel /> : null}</>;
}

function MatchMakerPanel() {
    const setMatchMaking = useSetAtom(IsMatchMakingAtom);
    const [battleField, setBattleField] = useState<BattleField>();
    const [gameMode, setGameMode] = useState<GameMode>();
    const [limit, setLimit] = useState(0);

    useGameMatchMakeConnector(useMemo(() => makeMatchmakeHandshakeQueue(), []));

    useWebSocket(
        "game",
        [GameClientOpcode.ENQUEUED, GameClientOpcode.MATCHMAKE_FAILED],
        (opcode, buffer) => {
            switch (opcode) {
                case GameClientOpcode.ENQUEUED: {
                    const [battleField, gameMode, limit] =
                        handleEnqueuedAlert(buffer);
                    setBattleField(battleField);
                    setGameMode(gameMode);
                    setLimit(limit);
                    break;
                }
                case GameClientOpcode.MATCHMAKE_FAILED: {
                    void handleMatchmakeFailed(buffer);
                    alert("매칭에 실패했습니다.");
                    break;
                }
            }
        },
    );

    const cancelMatchMaking = () => setMatchMaking(false);

    const [isOpen, setIsOpen] = useState(false);
    const timer = useTimer();
    const second = (timer % 60).toString().padStart(2, "0");
    const min = (timer / 60).toFixed();

    return (
        <div className="relative flex flex-col gap-1 text-gray-50">
            <div className="flex flex-col items-center justify-center bg-black/30">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative flex w-full justify-center px-3 py-2.5 text-base text-gray-50/80 hover:bg-primary/30 active:bg-secondary/30 "
                >
                    검색 중: {min}:{second}
                </button>
                {isOpen && (
                    <div className="flex w-fit shrink-0 overflow-clip rounded p-2">
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
                            className={`w-fit shrink-0  ${
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
                )}
            </div>
            <button
                type="button"
                className="right-3 bg-red-500/30 text-sm hover:bg-red-400/30 active:bg-red-300/30"
                onClick={cancelMatchMaking}
            >
                검색 취소
            </button>
        </div>
    );
}
