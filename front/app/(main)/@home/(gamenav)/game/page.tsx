"use client";

import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import {
    GameMemberAtom,
    GameRoomParamsAtom,
    GameRoomPropsAtom,
    InvitationAtom,
    LadderAtom,
} from "@atoms/GameAtom";
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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function GamePage() {
    const invitationAtom = useAtomValue(InvitationAtom, { store: GlobalStore });
    const router = useRouter();
    const [members, setMembers] = useAtom(GameMemberAtom);
    const setGameRoomProps = useSetAtom(GameRoomPropsAtom);
    const setGameRoomParams = useSetAtom(GameRoomParamsAtom);
    const setLadderAtom = useSetAtom(LadderAtom);

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
                    setGameRoomProps(props);
                    setMembers([...members]);
                    setGameRoomParams(params);
                    setLadderAtom(ladder);
                    break;
                }
                case GameClientOpcode.GAME_FAILED: {
                    const errno = handleGameFailedPayload(buffer);
                    if (errno !== GameRoomEnterResult.SUCCESS) {
                        handleGameError(errno);
                        router.push("/");
                    }
                    break;
                }
                case GameClientOpcode.ENTER_MEMBER: {
                    const newMember = handleEnterMember(buffer);
                    setMembers([...members, newMember]);
                    break;
                }
                case GameClientOpcode.UPDATE_MEMBER: {
                    const updatedMember = handleUpdateMember(buffer);
                    setMembers(
                        members.map((member) =>
                            updatedMember.accountId === member.accountId
                                ? updatedMember
                                : member,
                        ),
                    );
                    break;
                }
                case GameClientOpcode.LEAVE_MEMBER: {
                    const leftAccountId = handleLeaveMember(buffer);
                    setMembers(
                        members.filter(
                            (member) => member.accountId !== leftAccountId,
                        ),
                    );
                    break;
                }
            }
        },
    );

    return (
        <div className="h-full w-full">
            <GameLobby />
        </div>
    );
}
