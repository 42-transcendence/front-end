import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { CurrentAccountUUIDAtom } from "@atoms/AccountAtom";
import {
    GameMemberAtom,
    GameProgressAtom,
    GameRoomParamsAtom,
} from "@atoms/GameAtom";
import { GameClientOpcode } from "@common/game-opcodes";
import { Game } from "@gameEngine/game";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";

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

    return <canvas ref={canvasRef}></canvas>;
}
