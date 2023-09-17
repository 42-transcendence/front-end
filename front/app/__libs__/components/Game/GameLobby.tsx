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
import { makeReadyStateRequest } from "@akasha-utils/game-payload-builder-clients";
import { useCopyText } from "@hooks/useCopyText";
import {
    BattleField,
    GameMode,
    type GameMemberParams,
} from "@common/game-payloads";
import { partition } from "@utils/collections";
import { Icon } from "@components/ImageLibrary";
import { NickBlock } from "@components/ProfileItem/ProfileItem";
import { GUEST } from "@utils/constants";

type GameTeamParams = {
    id: number;
    name: string;
    members: GameMemberParams[];
};

const teamName = ["보라보라", "파랑파랑"];

export function GameLobby() {
    const members = useAtomValue(GameMemberAtom);
    const gameRoomProps = useAtomValue(GameRoomPropsAtom);

    const { sendPayload } = useWebSocket("game", []);

    const toggleReady = useCallback(
        (ready: boolean) => {
            sendPayload(makeReadyStateRequest(ready));
        },
        [sendPayload],
    );

    if (gameRoomProps === null) {
        return null;
    }

    const [teamA, teamB] = partition(
        members,
        (member: GameMemberParams) => member.team === 0,
    ).map((e, index) => ({ id: index, name: teamName[index], members: e }));

    return (
        <>
            <div className="relative h-full w-full overflow-hidden backdrop-blur-[50px] ">
                <div className="flex w-full flex-row items-center justify-between gap-2 bg-windowGlass/30 p-4 lg:px-8">
                    <GameLobbyHeader />
                </div>
                <div className="flex-col lg:px-40 2xl:px-80 ">
                    <section className="relative flex h-full w-full flex-col justify-around gap-4 overflow-hidden rounded-[40px] p-6 lg:flex-row lg:gap-20 lg:px-20">
                        {[teamA, teamB].map((team) => (
                            <TeamPanel
                                key={team.id}
                                team={team}
                                toggleReady={toggleReady}
                            />
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}

function GameLobbyHeader() {
    const gameRoomParams = useAtomValue(GameRoomParamsAtom);
    const ladder = useAtomValue(LadderAtom);
    const [roomCode, setRoomCode, copyRoomCode] = useCopyText();
    const gameRoomProps = useAtomValue(GameRoomPropsAtom);

    useEffect(() => {
        if (gameRoomProps !== null && gameRoomProps.code !== null) {
            setRoomCode(`https://${GUEST}/game/${gameRoomProps.code}`);
        }
    }, [gameRoomProps, setRoomCode]);

    return (
        <>
            <span className="w-20 font-extrabold italic lg:w-full lg:text-4xl">
                {ladder ? "QUICK MATCH" : "CUSTOM GAME"}
            </span>
            <div className="flex w-fit shrink-0 flex-row justify-center gap-2">
                <div className="flex w-fit shrink-0 items-center justify-center overflow-clip rounded-xl bg-windowGlass/30">
                    <span className="w-fit shrink-0 px-3 py-2.5 font-bold lg:text-xl">
                        {gameRoomParams === null
                            ? ""
                            : gameRoomParams.limit === 2
                            ? "1:1"
                            : "2:2"}
                    </span>
                    <span className="w-fit shrink-0 px-3 py-2.5 font-bold lg:text-xl">
                        {gameRoomParams === null
                            ? ""
                            : gameRoomParams.battleField === BattleField.ROUND
                            ? "동글동글"
                            : gameRoomParams.battleField === BattleField.SQUARE
                            ? "네모네모"
                            : "두근두근"}
                    </span>
                    <span
                        className={`flex h-full w-fit shrink-0 items-center  ${
                            gameRoomParams === null
                                ? ""
                                : gameRoomParams.gameMode === GameMode.UNIFORM
                                ? "bg-secondary/70"
                                : "bg-primary/70"
                        } px-3 py-2.5 font-bold lg:text-xl `}
                    >
                        {gameRoomParams === null
                            ? ""
                            : gameRoomParams.gameMode === GameMode.UNIFORM
                            ? "기본"
                            : gameRoomParams.gameMode === GameMode.GRAVITY
                            ? "중력"
                            : "두근"}
                    </span>
                </div>
                <button
                    type="button"
                    className="flex min-w-fit flex-row items-center justify-center rounded-xl p-2 hover:bg-primary/30 hover:text-gray-50/80 active:bg-secondary active:text-white"
                    onClick={() => copyRoomCode()}
                >
                    <Icon.Copy className="h-9 w-9 p-2" />
                    <span className="hidden p-2 lg:block">공유 링크 복사</span>
                </button>
            </div>
        </>
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
        <div className="flex h-full w-full flex-col">
            <span
                className={`
                flex items-center justify-center rounded-xl p-4 font-black italic text-gray-50/90
                ${
                    team.name === "보라보라"
                        ? "bg-primary/50"
                        : "bg-secondary/50"
                } text-xl lg:text-4xl`}
            >{`${team.name} 팀`}</span>
            <div className="flex p-4">
                {team.members.map((member) => (
                    <div
                        key={member.accountId}
                        className="flex w-full flex-row items-center justify-between rounded bg-black/30 p-4"
                    >
                        <div className="flex flex-row gap-2">
                            <Avatar
                                accountUUID={member.accountId}
                                className="relative h-12 w-12"
                                privileged={false}
                            />
                            <NickBlock accountUUID={member.accountId} />
                        </div>
                        <button
                            className={`${
                                member.ready
                                    ? "text-tertiary"
                                    : "text-gray-500/80"
                            } w-fit rounded border-red-400 p-4 text-xl italic transition-colors `}
                            onClick={() => toggleReady(!member.ready)}
                            disabled={currentAccountUUID !== member.accountId}
                        >
                            READY
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
