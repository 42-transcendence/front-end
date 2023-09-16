import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { CurrentAccountUUIDAtom } from "@atoms/AccountAtom";
import {
    GameMemberAtom,
    GameProgressAtom,
    GameRoomParamsAtom,
} from "@atoms/GameAtom";
import { handleUpdateGame } from "@common/game-gateway-helper-client";
import { GameClientOpcode } from "@common/game-opcodes";
import { Game } from "@gameEngine/game";
import { useAtomValue } from "jotai";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

function drawCircle(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    const diameter = 300;
    const left = window.innerWidth / 2;
    const top = window.innerHeight / 2;

    if (context === null) {
        return;
    }

    context.font = "50px serif";
    context.fillStyle = "blue";
    context.fillText("here", 100, 100);
}

export function GameInGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentAccountUUID = useAtomValue(CurrentAccountUUIDAtom);
    const gameMembers = useAtomValue(GameMemberAtom);
    const gameParams = useAtomValue(GameRoomParamsAtom);
    const gameProgress = useAtomValue(GameProgressAtom);

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
                    // const gameResult = handleGameResult(buffer);
                    // console.log("result", gameResult);
                    break;
                }
                case GameClientOpcode.UPDATE_GAME: {
                    const updateInfo = handleUpdateGame(buf);
                    if (
                        game !== null &&
                        updateInfo !== null &&
                        updateInfo.currentSet === game.getSetNumber()
                    ) {
                        game.setPlayerScore(updateInfo);
                    }
                    break;
                }
            }
        },
    );

    useEffect(() => {
        if (
            canvasRef.current === null ||
            gameProgress === null ||
            gameParams === null ||
            currentMember === undefined
        ) {
            return;
        }
        setGame((game) =>
            game === null
                ? new Game(
                      sendPayload,
                      gameProgress.currentSet,
                      currentMember.team,
                      gameParams.battleField,
                      [],
                      canvasRef,
                  )
                : game,
        );
    }, [currentMember, gameParams, gameProgress, sendPayload]);

    useEffect(() => {
        if (game !== null) {
            game.start();
        }
    }, [game]);

    return (
        <canvas
            ref={canvasRef}
            width={500}
            height={960}
            className="fixed left-0 top-0 cursor-none"
        ></canvas>
    );
}
