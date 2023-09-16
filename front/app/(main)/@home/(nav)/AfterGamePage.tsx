"use client";

export function AfterGamePage() {
    const data = {
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
        member: {
            asdf: { team: 0, ratingBefore: 1000, ratingAfter: 984 },
            zxcv: { team: 0, ratingBefore: 1000, ratingAfter: 985 },
            qwer: { team: 1, ratingBefore: 1238, ratingAfter: 1004 },
            hjkl: { team: 1, ratingBefore: 1321, ratingAfter: 1005 },
        },
        time: 538,
    };

    const currentAccountUUID = "asdf";
    const myTeam = data.member[currentAccountUUID].team;
    const isWin = data.team;
    return <div className="">{<span>승리</span>}</div>;
}
