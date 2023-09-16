"use client";

const mockData = {
    team: {
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
        { accountId: "asdf", team: 0, ratingBefore: 1000, ratingAfter: 984 },
        { accountId: "zxcv", team: 0, ratingBefore: 1000, ratingAfter: 985 },
        { accountId: "qwer", team: 1, ratingBefore: 1238, ratingAfter: 1004 },
        { accountId: "hjkl", team: 1, ratingBefore: 1321, ratingAfter: 1005 },
    ],
    time: 538,
};

import { Avatar } from "@components/Avatar";
import { NickBlock } from "@components/ProfileItem/ProfileItem";

export function AfterGamePage() {
    const gameResult = mockData;

    const currentAccountUUID = "asdf";
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
            <div className="text-7xl italic">
                {isWin ? (
                    <span className="text-secondary">승리</span>
                ) : (
                    <span className="text-red-500/80">패배</span>
                )}
            </div>
            <div className="flex h-full w-full flex-row p-4">
                {Object.values(gameResult.teams).map((team, index) => (
                    <TeamResult key={index} team={team} />
                ))}
            </div>
            <div className="flex h-full w-full flex-row p-4">
                {Object.keys(gameResult.teams).map((teamKey) =>
                    Object.values(gameResult.members)
                        .filter((member) => member.team === parseInt(teamKey))
                        .map((member) => (
                            <div key={member.accountId}>
                                <Avatar
                                    className="relative"
                                    accountUUID={member.accountId}
                                />
                                <NickBlock accountUUID={member.accountId} />
                            </div>
                        )),
                )}
            </div>
        </div>
    );
}
