"use client";

import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import {
    GameMemberAtom,
    GameProgressAtom,
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
    handleUpdateGame,
    handleUpdateMember,
} from "@common/game-gateway-helper-client";
import { GameClientOpcode } from "@common/game-opcodes";
import { makeGameHandshake } from "@common/game-payload-builder-client";
import { GameRoomEnterResult } from "@common/game-payloads";
import { GameInGame } from "@components/Game/GameInGame";
import { GameLobby } from "@components/Game/GameLobby";
import { handleGameError } from "@components/Game/handleGameError";
import { useGamePlayConnector } from "@hooks/useGameWebSocketConnector";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function GamePage() {
    const [invitationToken, setInvitationToken] = useAtom(InvitationAtom, {
        store: GlobalStore,
    });
    const router = useRouter();
    const [members, setMembers] = useAtom(GameMemberAtom);
    const setGameRoomProps = useSetAtom(GameRoomPropsAtom);
    const setGameRoomParams = useSetAtom(GameRoomParamsAtom);
    const setLadderAtom = useSetAtom(LadderAtom);
    const [localInvitationToken, setLocalInvitationToken] = useState("");
    const [isEnded, setIsEnded] = useState(false);

    const [currentGameProgress, setGameProgress] = useAtom(GameProgressAtom);

    useGamePlayConnector(
        useMemo(
            () => makeGameHandshake(localInvitationToken),
            [localInvitationToken],
        ),
        !isEnded && localInvitationToken !== "",
    );

    useEffect(() => {
        if (invitationToken === "") {
            if (localInvitationToken === "") {
                router.push("/");
            }
        } else {
            setGameProgress(null);
            setLocalInvitationToken(invitationToken);
            setInvitationToken("");
        }
    }, [
        invitationToken,
        localInvitationToken,
        router,
        setInvitationToken,
        setGameProgress,
    ]);

    useWebSocket("game", undefined, (opcode, buffer) => {
        switch (opcode) {
            case GameClientOpcode.GAME_ROOM: {
                const [props, params, members, ladder] = handleGameRoom(buffer);

                setGameRoomProps(props);
                setMembers([...members]);
                setGameRoomParams(params);
                setLadderAtom(ladder);
                break;
            }
            case GameClientOpcode.GAME_FAILED: {
                setInvitationToken("");
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
            case GameClientOpcode.UPDATE_GAME: {
                const progress = handleUpdateGame(buffer);
                setGameProgress(progress);
                break;
            }
            case GameClientOpcode.END_OF_GAME: {
                const incomplete = buffer.readBoolean();
                setIsEnded(true);
                if (incomplete) {
                    alert("게임이 미완료 상태로 끝났습니다.");
                    router.push("/");
                } else {
                    router.push("/game-result");
                }
                break;
            }
        }
    });

    return (
        <div className="h-full w-full">
            {!isEnded && currentGameProgress === null ? (
                <GameLobby />
            ) : (
                <GameInGame />
            )}
        </div>
    );
}
