import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { CurrentAccountUUIDAtom } from "@atoms/AccountAtom";
import {
    GameMemberAtom,
    GameProgressAtom,
    GameRoomParamsAtom,
    // GameRoomPropsAtom,
} from "@atoms/GameAtom";
import { handleResyncAll } from "@common/game-gateway-helper-client";
import { GameClientOpcode } from "@common/game-opcodes";
import { Game } from "@gameEngine/game";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

export function GameInGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentAccountUUID = useAtomValue(CurrentAccountUUIDAtom);
    const gameMembers = useAtomValue(GameMemberAtom);
    const gameParams = useAtomValue(GameRoomParamsAtom);
    // const gameProps = useAtomValue(GameRoomPropsAtom);
    const gameProgress = useAtomValue(GameProgressAtom);

    const currentMember = gameMembers.find(
        (member) => member.accountId === currentAccountUUID,
    );

    const [game, setGame] = useState<Game | null>(null);

    const { sendPayload } = useWebSocket(
        "game",
        [
            GameClientOpcode.RESYNC_ALL,
            GameClientOpcode.RESYNC_PART,
            GameClientOpcode.RESYNC_PARTOF,
        ],
        (opcode, buf) => {
            switch (opcode) {
                case GameClientOpcode.RESYNC_ALL: {
                    break;
                }
                case GameClientOpcode.RESYNC_PART: {
                    break;
                }
            }
        },
    );

    const foo = () => {
        const frames = handleResyncAll(buf);
        const size = frames.length;
        const lastSyncFrameId = frames[frames.length - 1].id;
        const diff = this.frames.length - lastSyncFrameId;
        if (diff > 1) {
            for (let i = 1; i < diff; i++) {
                this.ignoreFrameIds.add(lastSyncFrameId + i);
            }
            this.frames.splice(lastSyncFrameId + 1, diff - 1);
        } // 전부 리싱크하는 경우 그 이후의 프레임은 무시하고 삭제하도록 설정
        for (let i = 0; i < size; i++) {
            if (this.ignoreFrameIds.has(frames[i].id)) {
                this.ignoreFrameIds.delete(frames[i].id);
                continue;
            }
            if (this.team === TEAM2) {
                this.reverseFrame(frames[i]);
            }
            this.pasteFrame(frames[i]);
            this.frameQueue.push({
                resyncType: GameClientOpcode.RESYNC_ALL,
                frame: frames[i],
            });
        }
    };

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
