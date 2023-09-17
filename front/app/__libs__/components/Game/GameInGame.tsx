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

type SetOfGame = {
    set: number;
    score: number[];
};

export function GameInGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentAccountUUID = useAtomValue(CurrentAccountUUIDAtom);
    const gameMembers = useAtomValue(GameMemberAtom);
    const gameParams = useAtomValue(GameRoomParamsAtom);
    const gameProgress = useAtomValue(GameProgressAtom);
    const setGameStatistics = useSetAtom(GameStatisticsAtom);
    const setGameMemberStatistics = useSetAtom(GameMemberStatisticsAtom);
    const [scoreOfSet, setScoreOfSet] = useState<SetOfGame[]>();

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

    useEffect(() => {
        if (gameProgress === null || scoreOfSet === undefined) return;

        setScoreOfSet([
            ...scoreOfSet,
            { set: gameProgress.currentSet + 1, score: gameProgress.score },
        ]);
    }, [gameProgress, gameProgress?.currentSet, scoreOfSet]);

    return (
        <div className="flex h-full w-full items-center justify-center gap-4 p-4">
            <div className="gradient-border back-full relative flex w-[500px] rounded-[28px] bg-black/30 p-px backdrop-blur-[28px] before:rounded-[28px] before:p-px">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={960}
                    className="z-10 cursor-none rounded-[28px]"
                ></canvas>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg bg-windowGlass/30 p-4 text-xl italic text-gray-50 backdrop-blur-[50px]">
                <span className="pr-2 text-4xl">Score Board</span>
                <div className="flex gap-4">
                    <span className="">보라보라</span>
                    <span className="">파랑파랑</span>
                </div>
                <span className="">{gameProgress?.currentSet} 세트</span>

                <div className="flex gap-4">
                    {gameProgress?.score.map((score) => (
                        <span className="rounded bg-black/30 p-4" key={score}>
                            {score}
                        </span>
                    ))}
                </div>

                <span className="">누적 세트</span>

                <div className="flex flex-col gap-4">
                    {scoreOfSet?.map((setData) => {
                        return (
                            <div
                                key={setData.set}
                                className="flex flex-row items-center justify-center gap-4 overflow-hidden rounded bg-black/30 p-4"
                            >
                                <span className="text-xl italic">
                                    SET {setData.set}
                                </span>
                                <div className="flex flex-row gap-2">
                                    {setData.score.map((score, index) => {
                                        return (
                                            <span
                                                key={index}
                                                className="p-2 italic"
                                            >
                                                {setData.score}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-4"></div>
            </div>
        </div>
    );
}
