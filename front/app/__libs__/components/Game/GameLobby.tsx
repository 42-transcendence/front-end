"use client";

import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { Avatar } from "@components/Avatar";
import {
    GameMemberAtom,
    GameRoomParamsAtom,
    GameRoomPropsAtom,
    LadderAtom,
} from "@atoms/GameAtom";
import { useAtomValue } from "jotai";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { useCallback, useEffect } from "react";
import { HOST } from "@utils/constants";
import { makeReadyStateRequest } from "@akasha-utils/game-payload-builder-clients";
import { useCopyText } from "@hooks/useCopyText";
import {
    BattleField,
    GameMode,
    type GameMemberParams,
} from "@common/game-payloads";
import { partition } from "@utils/collections";
import { Icon } from "@components/ImageLibrary";

type GameTeamParams = {
    id: number;
    name: string;
    members: GameMemberParams[];
};

const teamName = ["보라보라", "파랑파랑"];

export function GameLobby() {
    const members = useAtomValue(GameMemberAtom);
    const gameRoomProps = useAtomValue(GameRoomPropsAtom);
    const gameRoomParams = useAtomValue(GameRoomParamsAtom);
    const ladder = useAtomValue(LadderAtom);
    const [roomCode, setRoomCode, copyRoomCode] = useCopyText();

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

    if (gameRoomProps === null || gameRoomParams === null) {
        return null;
    }

    const [teamA, teamB] = partition(
        members,
        (member: GameMemberParams) => member.team === 0,
    ).map((e, index) => ({ id: index, name: teamName[index], members: e }));

    return (
        <div className="h-full w-full overflow-hidden bg-windowGlass/30 p-4 backdrop-blur-[50px]">
            <div className="flex w-full flex-row justify-between gap-2 p-4">
                <span className="w-full text-4xl font-extrabold italic">
                    {ladder ? "QUICK MATCH" : "CUSTOM GAME"}
                </span>
                <div className="flex w-fit shrink-0 items-center justify-center overflow-clip rounded-xl bg-windowGlass/30">
                    <span className="w-fit shrink-0 px-3 py-2.5 text-xl font-bold">
                        {gameRoomParams.limit === 2 ? "1:1" : "2:2"}
                    </span>
                    <span className="w-fit shrink-0 px-3 py-2.5 text-xl font-bold">
                        {gameRoomParams.battleField === BattleField.ROUND
                            ? "동글동글"
                            : gameRoomParams.battleField === BattleField.SQUARE
                            ? "네모네모"
                            : "두근두근"}
                    </span>
                    <span
                        className={`flex h-full w-fit shrink-0 items-center  ${
                            gameRoomParams.gameMode === GameMode.UNIFORM
                                ? "bg-secondary/70"
                                : "bg-primary/70"
                        } px-3 py-2.5 text-xl font-bold `}
                    >
                        {gameRoomParams.gameMode === GameMode.UNIFORM
                            ? "기본"
                            : gameRoomParams.gameMode === GameMode.GRAVITY
                            ? "중력"
                            : "두근"}
                    </span>
                </div>
                <button
                    type="button"
                    className="flex min-w-fit flex-row items-center justify-center gap-2 rounded-xl p-2 hover:bg-primary/30 hover:text-gray-50/80 active:bg-secondary active:text-white"
                    onClick={() => copyRoomCode()}
                >
                    <Icon.Copy />
                    공유 링크 복사
                </button>
            </div>
            <section className="relative flex w-full flex-row justify-around">
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
        <div className="flex flex-col">
            <span
                className={`
                rounded-[28px_28px_0px_0px] p-4
                ${
                    team.name === "보라보라"
                        ? "bg-primary/30"
                        : "bg-secondary/30"
                } text-4xl`}
            >{`${team.name} 팀`}</span>
            {team.members.map((member) => (
                <div
                    key={member.accountId}
                    className={`
                    ${
                        member.accountId === currentAccountUUID
                            ? "bg-secondary/30"
                            : "bg-black/30"
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
