"use client";

type GameResult = {
    teams: {
        0: {
            total: number;
            set: number[];
        };
        1: {
            total: number;
            set: number[];
        };
    };
    members: {
        accountId: string;
        team: number;
        ratingBefore: number;
        ratingAfter: number;
    }[];
    time: number;
};

const mockData = {
    teams: {
        0: {
            total: 3,
            set: [8, 15, 11, 4, 15, 15, 9],
        },
        1: {
            total: 4,
            set: [15, 14, 15, 15, 9, 4, 15],
        },
    },
    members: [
        {
            accountId: "c89e1195-441a-4407-a525-17f7c35ecf8b",
            team: 0,
            ratingBefore: 1000,
            ratingAfter: 984,
        },
        {
            accountId: "700d36e5-5adc-4a75-97cf-aec57a571798",
            team: 0,
            ratingBefore: 1000,
            ratingAfter: 985,
        },
        {
            accountId: "cd775c9e-0c05-40ba-b6ce-5e54817c9bca",
            team: 1,
            ratingBefore: 1000,
            ratingAfter: 1004,
        },
        {
            accountId: "d041873f-2fa1-47e0-9960-3b7462f7200a",
            team: 1,
            ratingBefore: 1000,
            ratingAfter: 1005,
        },
    ],
    time: 538,
};

import { Avatar } from "@components/Avatar";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { NickBlock } from "@components/ProfileItem/ProfileItem";
import { useCurrentAccountUUID } from "@hooks/useCurrent";

function GamePanel({ children }: { children: React.ReactNode }) {
    return <div className="flex w-full flex-row gap-4">{children}</div>;
}

export function AfterGamePage() {
    const gameResult = mockData;
    const currentAccountUUID = useCurrentAccountUUID();
    console.log(currentAccountUUID);

    const myMember = gameResult.members.find(
        (member) => member.accountId === currentAccountUUID,
    );

    if (myMember === undefined) {
        return <div>loading</div>;
    }
    const myTeam = myMember.team;
    const winTeam =
        gameResult.teams[0].total > gameResult.teams[1].total ? 0 : 1;
    const isWin = myTeam === winTeam;

    const second = (gameResult.time % 60).toString().padStart(2, "0");
    const min = (gameResult.time / 60).toFixed();

    return (
        <div className="flex h-full w-full flex-col items-center justify-start lg:p-16">
            <GlassWindow className="h-full w-full">
                <div className="flex h-full w-full flex-col gap-4 p-8">
                    <div className="flex w-full items-center justify-center text-7xl italic">
                        {isWin ? (
                            <span className="text-secondary">승리</span>
                        ) : (
                            <span className="text-red-500/80">패배</span>
                        )}
                    </div>

                    <div className="flex w-full justify-center">
                        <span className="text-xl">
                            게임 시간: {min}:{second}
                        </span>
                    </div>

                    <GamePanel>
                        <SetFrame className="items-start">
                            <TeamResult team={gameResult.teams[0]} />
                        </SetFrame>
                        <SetFrame className="items-center">
                            {gameResult.teams[0].set.map((_, index) => (
                                <span
                                    key={index}
                                    className="font-black italic text-white"
                                >
                                    SET {index + 1}
                                </span>
                            ))}
                        </SetFrame>
                        <SetFrame className="items-end">
                            <TeamResult team={gameResult.teams[1]} />
                        </SetFrame>
                    </GamePanel>
                    <GamePanel>
                        {Object.keys(gameResult.teams).map((teamKey) => (
                            <MembersSection
                                key={teamKey}
                                teamKey={teamKey}
                                gameResult={gameResult}
                            />
                        ))}
                    </GamePanel>
                </div>
            </GlassWindow>
        </div>
    );
}

function SetFrame({
    className,
    children,
}: {
    className: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`${className} flex w-full flex-col`}>{children}</div>
    );
}

function MembersSection({
    teamKey,
    gameResult,
}: {
    teamKey: string;
    gameResult: GameResult;
}) {
    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-black/30 p-4">
            {Object.values(gameResult.members)
                .filter((member) => member.team === parseInt(teamKey))
                .map((member) => {
                    return (
                        <MemberSection key={member.accountId} member={member} />
                    );
                })}
        </div>
    );
}

function MemberSection({
    member,
}: {
    member: {
        accountId: string;
        team: number;
        ratingBefore: number;
        ratingAfter: number;
    };
}) {
    const delta = member.ratingAfter - member.ratingBefore;
    return (
        <div className="flex flex-col items-start justify-between gap-2 p-2 lg:flex-row">
            <div className="flex flex-row gap-4">
                <Avatar
                    className="relative h-10 w-10 lg:h-16 lg:w-16"
                    accountUUID={member.accountId}
                    privileged={false}
                />

                <NickBlock accountUUID={member.accountId} />
            </div>
            <span className="flex flex-col px-1 italic text-gray-50/80">
                <span className="text-3xl text-white">
                    {member.ratingAfter}
                </span>
                <div className="flex gap-1">
                    {member.ratingBefore}
                    <span className="text-tertiary/80">
                        [{delta > 0 && "+"}
                        {delta}]
                    </span>
                </div>
            </span>
        </div>
    );
}

function TeamResult({
    team,
}: {
    team: {
        total: number;
        set: number[];
    };
}) {
    return team.set.map((score, index) => <span key={index}>{score}</span>);
}
