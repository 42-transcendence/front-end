"use client";

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
            ratingBefore: 1238,
            ratingAfter: 1004,
        },
        {
            accountId: "d041873f-2fa1-47e0-9960-3b7462f7200a",
            team: 1,
            ratingBefore: 1321,
            ratingAfter: 1005,
        },
    ],
    time: 538,
};

import { Avatar } from "@components/Avatar";
import { NickBlock } from "@components/ProfileItem/ProfileItem";
import { useCurrentAccountUUID } from "@hooks/useCurrent";

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

    return (
        <div className="flex h-full w-full flex-col items-center justify-start bg-windowGlass/30 p-16 backdrop-blur-[30px]">
            <div className="p-12 text-7xl italic">
                {isWin ? (
                    <span className="text-secondary">승리</span>
                ) : (
                    <span className="text-red-500/80">패배</span>
                )}
            </div>
            <div className="flex w-full flex-row gap-16 p-4">
                {Object.values(gameResult.teams).map((team, index) => (
                    <TeamResult key={index} team={team} />
                ))}
            </div>
            <div className="flex w-full flex-row gap-16 p-4">
                {Object.keys(gameResult.teams).map((teamKey) => {
                    return (
                        <div
                            key={teamKey}
                            className="relative w-full bg-black/30 p-4"
                        >
                            {Object.values(gameResult.members)
                                .filter(
                                    (member) =>
                                        member.team === parseInt(teamKey),
                                )
                                .map((member) => (
                                    <div
                                        key={member.accountId}
                                        className="flex flex-row gap-4 p-2"
                                    >
                                        <Avatar
                                            className="relative h-12 w-12"
                                            accountUUID={member.accountId}
                                            privileged={false}
                                        />
                                        <NickBlock
                                            accountUUID={member.accountId}
                                        />
                                        <div>{}</div>
                                    </div>
                                ))}
                        </div>
                    );
                })}
            </div>
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
    return (
        <div className="w-full bg-black/30 p-4">
            {team.set.map((score, index) => (
                <div className="flex w-full justify-between italic" key={index}>
                    <span>SET {index + 1}</span>
                    <span>{score}</span>
                </div>
            ))}
            <span> </span>
        </div>
    );
}
