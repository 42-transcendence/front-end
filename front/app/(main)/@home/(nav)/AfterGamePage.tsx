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

export function AfterGamePage() {
    const gameResult = mockData;

    const currentAccountUUID = "asdf";
    const myMember = gameResult.members.find(
        (member) => member.accountId === currentAccountUUID,
    );

    if (myMember === undefined) {
        // 이거 뭐지
        return <div>loading</div>;
    }
    //hdoo님 이런 식은 어떤가요
    const myTeam = myMember.team;
    const winTeam = gameResult.team[0].total > gameResult.team[1].total ? 0 : 1;
    const isWin = myTeam === winTeam;
    return (
        <div className="">{isWin ? <span>승리</span> : <span>패배</span>}</div>
    );
}
