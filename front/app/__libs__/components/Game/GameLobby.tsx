"use client";

import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Avatar } from "@components/Avatar";
import { GameMemberAtom, GameRoomPropsAtom } from "@atoms/GameAtom";
import { useAtomValue } from "jotai";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { useCallback, useEffect } from "react";
import { HOST } from "@utils/constants";
import { makeReadyStateRequest } from "@akasha-utils/game-payload-builder-clients";
import { useCopyText } from "@hooks/useCopyText";
import type { GameMemberParams } from "@common/game-payloads";
import { partition } from "@utils/collections";

type GameTeamParams = {
    id: number;
    name: string;
    members: GameMemberParams[];
};

// function useAudio(src: string) {
//     useEffect(() => {
//         const audio = new Audio(src);
//         audio.onload = () => audio.play();
//
//         return () => audio.pause();
//     }, [src]);
// }

const teamName = ["A", "B"];

export function GameLobby() {
    const members = useAtomValue(GameMemberAtom);
    const gameRoomProps = useAtomValue(GameRoomPropsAtom);
    const [roomCode, setRoomCode, copyRoomCode] = useCopyText({
        onSuccess: "복사 완료!",
        onFailure: "복사 실패",
    });

    const { sendPayload } = useWebSocket("game", []);

    const toggleReady = useCallback(
        (ready: boolean) => {
            sendPayload(makeReadyStateRequest(ready));
        },
        [sendPayload],
    );

    useEffect(() => {
        if (gameRoomProps !== null && gameRoomProps.code !== null) {
            setRoomCode(`https://${HOST}/game/${gameRoomProps.code}`);
        }
    }, [gameRoomProps, setRoomCode]);

    if (gameRoomProps === null) {
        return null;
    }

    const [teamA, teamB] = partition(
        members,
        (member: GameMemberParams) => member.team === 0,
    ).map((e, index) => ({ id: index, name: teamName[index], members: e }));

    return (
        <div>
            <button type="button" onClick={() => copyRoomCode()}>
                방 주소: {roomCode}
            </button>
            <section className="flex flex-row">
                {[teamA, teamB].map((team) => (
                    <TeamPanel
                        key={team.id}
                        team={team}
                        toggleReady={toggleReady}
                    />
                ))}
            </section>
        </div>
    );
}

function TeamPanel({
    team,
    toggleReady,
}: {
    team: GameTeamParams;
    toggleReady: (x: boolean) => void;
}) {
    const currentAccountUUID = useCurrentAccountUUID();
    return (
        <div className="flex flex-col bg-primary/30">
            {`team ${team.name}`}
            {team.members.map((member) => (
                <div
                    key={member.accountId}
                    className={`${
                        member.accountId === currentAccountUUID ? "" : ""
                    }`}
                >
                    <Avatar
                        accountUUID={member.accountId}
                        className="relative h-12 w-12"
                        privileged={false}
                    />
                    <button
                        className="border-red-400"
                        onClick={() => toggleReady(!member.ready)}
                        disabled={currentAccountUUID !== member.accountId}
                    >
                        {member.ready ? "ready" : "unready"}
                    </button>
                </div>
            ))}
        </div>
    );
}
