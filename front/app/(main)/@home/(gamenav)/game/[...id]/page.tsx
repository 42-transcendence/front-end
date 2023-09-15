"use client";

import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { InvitationAtom } from "@atoms/GameAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import {
    handleEnterMember,
    handleGameFailedPayload,
    handleGameRoom,
    handleLeaveMember,
    handleUpdateMember,
} from "@common/game-gateway-helper-client";
import { GameClientOpcode } from "@common/game-opcodes";
import { makeGameHandshake } from "@common/game-payload-builder-client";
import { GameRoomEnterResult } from "@common/game-payloads";
import { GameLobby } from "@components/Game/GameLobby";
import { handleGameError } from "@components/Game/handleGameError";
import { useGamePlayConnector } from "@hooks/useGameWebSocketConnector";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function GamePage() {
    const invitationAtom = useAtomValue(InvitationAtom, { store: GlobalStore });
    const router = useRouter();

    useGamePlayConnector(
        useMemo(() => makeGameHandshake(invitationAtom), [invitationAtom]),
    );

    const { sendPayload } = useWebSocket(
        "game",
        undefined,
        (opcode, buffer) => {
            switch (opcode) {
                case GameClientOpcode.GAME_ROOM: {
                    const [props, params, members, ladder] =
                        handleGameRoom(buffer);
                    break;
                }
                case GameClientOpcode.GAME_FAILED: {
                    const errno = handleGameFailedPayload(buffer);
                    if (errno !== GameRoomEnterResult.SUCCESS) {
                        handleGameError(errno);
                        router.push("/");
                        return;
                    } else {
                    }
                    break;
                }
                case GameClientOpcode.ENTER_MEMBER: {
                    const [accountId, character, specification, team, ready] =
                        handleEnterMember(buffer);
                    break;
                }
                case GameClientOpcode.UPDATE_MEMBER: {
                    const [accountId, character, specification, team, ready] =
                        handleUpdateMember(buffer);
                    break;
                }
                case GameClientOpcode.LEAVE_MEMBER: {
                    const accountId = handleLeaveMember(buffer);
                    break;
                }
            }
        },
    );

    return <GameLobby />;
}
