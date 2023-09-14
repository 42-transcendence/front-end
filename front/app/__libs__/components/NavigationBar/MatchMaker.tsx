"use client";
import {
    useWebSocket,
    useWebSocketConnector,
} from "@akasha-utils/react/websocket-hook";
import { GameClientOpcode, GameServerOpcode } from "@common/game-opcodes";
import { useTimer } from "@hooks/useTimer";
import { useCallback, useMemo } from "react";
import { ByteBuffer } from "../../akasha-lib/library/byte-buffer";
import { GameMatchmakeType } from "@common/game-payloads";
import { ACCESS_TOKEN_KEY, HOST } from "@hooks/fetcher";

export function MatchMakerPanel() {
    const props = useMemo(
        () => ({
            handshake: () => {
                const buf = ByteBuffer.createWithOpcode(
                    GameServerOpcode.HANDSHAKE_MATCHMAKE,
                );
                buf.write1(GameMatchmakeType.QUEUE);
                return buf.toArray();
            },
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
                case GameClientOpcode.INVITATION:
                case GameClientOpcode.ENQUEUED:
                case GameClientOpcode.MATCHMAKE_FAILED:
            }
        },
    );

    const config = { field: "동글동글", mode: "중력" };
    const timer = useTimer();

    const second = (timer % 60).toString().padStart(2, "0");
    const min = (timer / 60).toFixed();

    return (
        <div className="relative flex flex-col items-start justify-center gap-2 rounded-lg bg-black/30 p-2">
            <div className="flex w-fit shrink-0 rounded">
                <span className="w-fit shrink-0 bg-black/30 px-1 py-0.5 text-sm font-bold">
                    {config.field}
                </span>
                <span
                    className={`w-fit shrink-0 ${
                        config.mode === "기본"
                            ? "bg-secondary/70"
                            : "bg-primary/70"
                    } px-1 py-0.5 text-sm font-bold `}
                >
                    {config.mode}
                </span>
            </div>
            <span className="text-sm text-gray-300/80">
                게임 찾는 중: {min}:{second}
            </span>
        </div>
    );
}
