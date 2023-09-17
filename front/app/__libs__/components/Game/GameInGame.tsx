import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { CurrentAccountUUIDAtom } from "@atoms/AccountAtom";
import {
    GameMemberAtom,
    GameProgressAtom,
    GameStatisticsAtom,
    GameRoomParamsAtom,
    GameMemberStatisticsAtom,
} from "@atoms/GameAtom";
import { handleUpdateGame } from "@common/game-gateway-helper-client";
import { GameClientOpcode } from "@common/game-opcodes";
import {
    readGameMemberStatistics,
    readGameStatistics,
} from "@common/game-payloads";
import { Game } from "@gameEngine/game";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";

export function GameInGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentAccountUUID = useAtomValue(CurrentAccountUUIDAtom);
    const gameMembers = useAtomValue(GameMemberAtom);
    const gameParams = useAtomValue(GameRoomParamsAtom);
    const gameProgress = useAtomValue(GameProgressAtom);
    const setGameStatistics = useSetAtom(GameStatisticsAtom);
    const setGameMemberStatistics = useSetAtom(GameMemberStatisticsAtom);

    const currentMember = useMemo(
        () =>
            gameMembers.find(
                (member) => member.accountId === currentAccountUUID,
            ),
        [currentAccountUUID, gameMembers],
    );

    const [game, setGame] = useState<Game | null>(null);

    const { sendPayload } = useWebSocket(
        "game",
        [
            GameClientOpcode.RESYNC_ALL,
            GameClientOpcode.RESYNC_PART,
            GameClientOpcode.UPDATE_GAME,
        ],
        (opcode, buf) => {
            switch (opcode) {
                case GameClientOpcode.RESYNC_ALL: {
                    if (game !== null) {
                        game.resyncAllOpcodeHandler(buf);
                    }
                    break;
                }
                case GameClientOpcode.RESYNC_PART: {
                    if (game !== null) {
                        game.resyncPartOpcodeHandler(buf);
                    }
                    break;
                }
                case GameClientOpcode.GAME_RESULT: {
                    const statistics = readGameStatistics(buf);
                    const memberStatistics = buf.readArray(
                        readGameMemberStatistics,
                    );
                    setGameStatistics(statistics);
                    setGameMemberStatistics(memberStatistics);
                    break;
                }
                case GameClientOpcode.UPDATE_GAME: {
                    const updateInfo = handleUpdateGame(buf);
                    if (game !== null && updateInfo !== null) {
                        game.setGameProgress(updateInfo);
                    }
                    break;
                }
            }
        },
    );

    useEffect(() => {
        if (
            canvasRef.current === null ||
            gameParams === null ||
            currentMember === undefined
        ) {
            return;
        }
        const game = new Game(
            sendPayload,
            currentMember.team,
            gameParams.battleField,
            [], // TODO: gravity
            canvasRef,
        );
        setGame(game);

        return () => game.stopGame();
    }, [currentMember, gameParams, sendPayload]);

    useEffect(() => {
        if (game !== null) {
            game.start();
        }
    }, [game]);

    return (
        <div className="flex h-full w-full justify-center bg-space bg-cover p-4">
            <div className="gradient-border back-full relative flex w-fit rounded-[28px] bg-black/30 p-px backdrop-blur-[28px] before:rounded-[28px] before:p-px">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={960}
                    className="z-10 rounded-[28px]"
                ></canvas>
            </div>
            <span>{gameProgress?.score}</span>
        </div>
    );
}
