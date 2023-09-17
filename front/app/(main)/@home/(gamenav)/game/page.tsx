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
import { AfterGamePage } from "../../(nav)/AfterGamePage";

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

    const [currentGameProgress, setGameProgress] = useAtom(GameProgressAtom);

    useGamePlayConnector(
        useMemo(
            () => makeGameHandshake(localInvitationToken),
            [localInvitationToken],
        ),
        localInvitationToken !== "",
    );

    useEffect(() => {
        if (invitationToken === "") {
            if (localInvitationToken === "") {
                router.push("/"); // TODO 로직 제대로 되는지 확인하기
            }
        } else {
            setLocalInvitationToken(invitationToken);
            setInvitationToken("");
        }
    }, [invitationToken, localInvitationToken, router, setInvitationToken]);

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
                // XXX 과거 프로그레스 필요할수도
                setGameProgress(progress);
                break;
            }
            case GameClientOpcode.END_OF_GAME: {
                router.push("/game-result");
                break;
            }
        }
    });

    return (
        <div className="h-full w-full">
            {currentGameProgress === null ? <GameLobby /> : <GameInGame />}
        </div>
    );
}

// currentSet === maxSet;
// GAME_RESULT packet;
// currentGameProgress atom === null
//
