"use client";

import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { InvitationAtom } from "@atoms/GameAtom";
import { GameClientOpcode } from "@common/game-opcodes";
import { makeGameHandshake } from "@common/game-payload-builder-client";
import { GameLobby } from "@components/Game/GameLobby";
import { useGamePlayConnector } from "@hooks/useGameWebSocketConnector";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

export default function GamePage() {
    const invitationAtom = useAtomValue(InvitationAtom);

    useGamePlayConnector(
        useMemo(() => makeGameHandshake(invitationAtom), [invitationAtom]),
    );

    useWebSocket("game", undefined, (opcode, _buffer) => {
        switch (opcode) {
            case GameClientOpcode.GAME_ROOM: {
                break;
            }
            case GameClientOpcode.GAME_FAILED: {
                break;
            }
            case GameClientOpcode.ENTER_MEMBER: {
                break;
            }
            case GameClientOpcode.UPDATE_MEMBER: {
                break;
            }
            case GameClientOpcode.LEAVE_MEMBER: {
                break;
            }
            case GameClientOpcode.SYNCHRONIZE_RESULT: {
                break;
            }
            case GameClientOpcode.RESYNCHRONIZE_REQUEST: {
                break;
            }
            case GameClientOpcode.UPDATE_GAME: {
                break;
            }
            case GameClientOpcode.GAME_INTERMEDIATE_RESULT: {
                break;
            }
            case GameClientOpcode.GAME_FINAL_RESULT: {
                break;
            }
            case GameClientOpcode.ACHIEVEMENT: {
                break;
            }
        }
    });

    return <GameLobby />;
}
