import { useState } from "react";
import { Avatar } from "../Avatar";
import { Panel } from "./Panel";
import {
    IconCheck,
    IconMagicCircleComplex,
    IconMagicCircleDoubleBorder,
} from "../ImageLibrary";

type AccountUUID = string;

type Team = {
    player1: AccountUUID;
    player2?: AccountUUID;
};

type SetScore = {
    set: number;
    ally: number;
    enemy: number;
};

type GameConfig = {
    TeamSizes: "1:1" | "2:2";
    queueType: "CUSTOM" | "RANK";
    mode: "기본" | "중력";
    field: "동글동글" | "네모네모";
};

type GameStatistics = {
    startTimeStamp: string;
    playTime: string;
};

type GameHistory = {
    ally: Team;
    enemy: Team;
    set: SetScore[];
    config: GameConfig;
    statistics: GameStatistics;
    gameUUID: string;
    rating: number;
};

const GameHIstoryMockup: GameHistory[] = [
    {
        gameUUID: "1",
        rating: 1231,
        ally: {
            player1: "123",
            player2: "456",
        },
        enemy: {
            player1: "123",
            player2: "456",
        },
        set: [
            { set: 1, ally: 3, enemy: 2 },
            { set: 2, ally: 2, enemy: 3 },
            { set: 3, ally: 3, enemy: 2 },
            { set: 4, ally: 2, enemy: 3 },
            { set: 5, ally: 3, enemy: 2 },
        ],
        config: {
            TeamSizes: "2:2",
            queueType: "CUSTOM",
            mode: "기본",
            field: "동글동글",
        },
        statistics: {
            startTimeStamp: "3 days ago",
            playTime: "15m 23s",
        },
    },
    {
        gameUUID: "22",
        rating: 1231,
        ally: {
            player1: "789",
            player2: "101",
        },
        enemy: {
            player1: "112",
            player2: "131",
        },
        set: [
            { set: 1, ally: 2, enemy: 3 },
            { set: 2, ally: 1, enemy: 3 },
            { set: 3, ally: 3, enemy: 1 },
            { set: 4, ally: 2, enemy: 2 },
        ],
        config: {
            TeamSizes: "2:2",
            queueType: "RANK",
            mode: "중력",
            field: "네모네모",
        },
        statistics: {
            startTimeStamp: "5 days ago",
            playTime: "20m 05s",
        },
    },
    {
        gameUUID: "3",
        rating: 1231,
        ally: {
            player1: "415",
        },
        enemy: {
            player1: "161",
        },
        set: [
            { set: 1, ally: 3, enemy: 2 },
            { set: 2, ally: 3, enemy: 1 },
        ],
        config: {
            TeamSizes: "1:1",
            queueType: "CUSTOM",
            mode: "기본",
            field: "동글동글",
        },
        statistics: {
            startTimeStamp: "2 days ago",
            playTime: "10m 15s",
        },
    },
    {
        gameUUID: "4",
        rating: 1231,
        ally: {
            player1: "162",
            player2: "173",
        },
        enemy: {
            player1: "184",
            player2: "195",
        },
        set: [
            { set: 1, ally: 2, enemy: 3 },
            { set: 2, ally: 1, enemy: 3 },
        ],
        config: {
            TeamSizes: "2:2",
            queueType: "CUSTOM",
            mode: "중력",
            field: "네모네모",
        },
        statistics: {
            startTimeStamp: "1 day ago",
            playTime: "17m 10s",
        },
    },
    {
        gameUUID: "5",
        rating: 1231,
        ally: {
            player1: "206",
        },
        enemy: {
            player1: "217",
        },
        set: [
            { set: 1, ally: 3, enemy: 0 },
            { set: 2, ally: 2, enemy: 1 },
        ],
        config: {
            TeamSizes: "1:1",
            queueType: "RANK",
            mode: "기본",
            field: "동글동글",
        },
        statistics: {
            startTimeStamp: "4 days ago",
            playTime: "12m 45s",
        },
    },
    {
        gameUUID: "6",
        rating: 1231,
        ally: {
            player1: "228",
            player2: "239",
        },
        enemy: {
            player1: "240",
            player2: "251",
        },
        set: [
            { set: 1, ally: 1, enemy: 3 },
            { set: 2, ally: 2, enemy: 2 },
        ],
        config: {
            TeamSizes: "2:2",
            queueType: "CUSTOM",
            mode: "중력",
            field: "동글동글",
        },
        statistics: {
            startTimeStamp: "2 days ago",
            playTime: "14m 20s",
        },
    },
    {
        gameUUID: "7",
        rating: 1231,
        ally: {
            player1: "262",
        },
        enemy: {
            player1: "273",
        },
        set: [
            { set: 1, ally: 3, enemy: 2 },
            { set: 2, ally: 1, enemy: 3 },
            { set: 3, ally: 2, enemy: 3 },
        ],
        config: {
            TeamSizes: "1:1",
            queueType: "RANK",
            mode: "기본",
            field: "네모네모",
        },
        statistics: {
            startTimeStamp: "3 days ago",
            playTime: "9m 50s",
        },
    },
    {
        gameUUID: "8",
        rating: 1231,
        ally: {
            player1: "284",
            player2: "295",
        },
        enemy: {
            player1: "306",
            player2: "317",
        },
        set: [
            { set: 1, ally: 2, enemy: 1 },
            { set: 2, ally: 2, enemy: 3 },
            { set: 3, ally: 3, enemy: 0 },
        ],
        config: {
            TeamSizes: "2:2",
            queueType: "CUSTOM",
            mode: "중력",
            field: "동글동글",
        },
        statistics: {
            startTimeStamp: "6 days ago",
            playTime: "16m 5s",
        },
    },
    {
        gameUUID: "9",
        rating: 1231,
        ally: {
            player1: "328",
        },
        enemy: {
            player1: "339",
        },
        set: [
            { set: 1, ally: 1, enemy: 3 },
            { set: 2, ally: 3, enemy: 1 },
            { set: 3, ally: 1, enemy: 3 },
        ],
        config: {
            TeamSizes: "1:1",
            queueType: "RANK",
            mode: "기본",
            field: "네모네모",
        },
        statistics: {
            startTimeStamp: "7 days ago",
            playTime: "11m 30s",
        },
    },
];

export function GameHistoryPanel() {
    return (
        <>
            <input
                type="checkbox"
                className="hidden peer"
                id="GameHistoryPanel"
            />
            <Panel
                className={`flex h-full flex-col items-start justify-start overflow-clip peer-checked:h-fit md:col-span-2 md:row-span-1`}
            >
                <label
                    htmlFor="GameHistoryPanel"
                    className="flex z-10 flex-row justify-between items-center p-4 w-full"
                >
                    <span className="text-xl font-extrabold text-white">
                        전적
                    </span>
                </label>
                <div className="flex overflow-auto flex-col gap-2 w-full">
                    {GameHIstoryMockup.map((gameHIstory, index) => (
                        <GameHistoryItem key={index} history={gameHIstory} />
                    ))}
                </div>
            </Panel>
        </>
    );
}

function GameHistoryItem({ history }: { history: GameHistory }) {
    const [opened, setOpened] = useState(false);
    //TODO: get state from server

    return (
        <div className="group relative flex w-full shrink-0 flex-col items-center overflow-clip rounded-xl bg-black/30 @container">
            <GameHistorySummary history={history} />
            <input
                onChange={() => {
                    setOpened(!opened);
                }}
                checked={opened}
                type="checkbox"
                id={history.gameUUID}
                className="hidden peer"
            />
            <div className="hidden w-full peer-checked:flex">
                <GameHistoryDetail history={history} />
            </div>
        </div>
    );
}

function GameHistorySummary({ history }: { history: GameHistory }) {
    const winCount = history.set.filter(
        (setScore) => setScore.ally > setScore.enemy,
    ).length;
    const loseCount = history.set.length - winCount;
    const gameResult = winCount > loseCount ? "WIN" : "LOSE";

    return (
        <div className="flex flex-row justify-start self-stretch">
            <div>
                <label
                    htmlFor={history.gameUUID}
                    className="flex relative justify-center items-center p-4 w-20 h-full shrink-0 overflow-clip bg-black/30 hover:bg-black/20 active:bg-black/10"
                >
                    <IconMagicCircleComplex
                        className={`absolute -left-5 -top-4 text-white/10 ${
                            gameResult === "WIN" ? "" : "hidden"
                        }`}
                        width="200%"
                        height="200%"
                    />
                    <span className="text-base italic font-extrabold w-fit">
                        {gameResult}
                    </span>
                </label>
            </div>

            <div className="flex flex-row justify-between self-stretch w-full">
                <div className="flex flex-col justify-center items-start p-4">
                    <span
                        className={`w-fit rounded px-1 py-0.5 text-base font-extrabold italic ${
                            history.config.queueType === "RANK"
                                ? "text-tertiary"
                                : ""
                        }`}
                    >
                        {history.config.queueType}
                    </span>

                    <div className="flex rounded w-fit shrink-0">
                        <span className="py-0.5 px-1 text-xs font-bold w-fit shrink-0 bg-black/30">
                            {history.config.field}
                        </span>
                        <span className="py-0.5 px-1 text-xs font-bold w-fit shrink-0 bg-primary/70">
                            {history.config.mode}
                        </span>
                    </div>
                </div>

                <Seperator />

                <div className="flex gap-2 justify-center items-center p-4">
                    <span className="p-2 text-2xl rounded bg-black/30">
                        {winCount}
                    </span>
                    <span className="p-2 text-2xl rounded bg-black/30">
                        {loseCount}
                    </span>
                </div>

                <Seperator className="hidden @md:flex" />

                <div className="hidden flex-col items-center p-4 @md:flex">
                    <span className="py-0.5 px-1 text-sm italic font-extrabold rounded w-fit">
                        RATING
                    </span>
                    <span
                        className={`w-fit rounded px-1 py-0.5 text-sm font-extrabold italic ${
                            history.config.queueType === "RANK"
                                ? "text-tertiary"
                                : ""
                        }`}
                    >
                        {history.config.queueType === "RANK"
                            ? history.rating
                            : "-"}
                    </span>
                </div>

                <div className="flex flex-row justify-between">
                    <Seperator className="hidden @2xl:flex" />

                    <div className="hidden flex-col items-center justify-center p-4 pr-0 @3xl:flex">
                        <span className="py-0.5 px-1 text-lg italic font-extrabold rounded w-fit">
                            Player
                        </span>
                    </div>

                    <div className="hidden flex-col items-center justify-center p-4 @2xl:flex">
                        <ProfileBlockInGame
                            teamSize={history.config.TeamSizes}
                            team={history.ally}
                        />
                    </div>

                    <div className="hidden flex-col items-center justify-center p-4 @2xl:flex">
                        <ProfileBlockInGame
                            teamSize={history.config.TeamSizes}
                            team={history.enemy}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function GameHistoryDetail({ history }: { history: GameHistory }) {
    return (
        <div className="flex flex-col justify-center items-start w-full">
            {history.set.map((oneSet, index) => (
                <SetScore setData={oneSet} key={index} />
            ))}
        </div>
    );
}

function SetScore({ setData }: { setData: SetScore }) {
    const winned = setData.ally > setData.enemy;

    return (
        <div className={`flex w-full ${winned && "bg-secondary/20"}`}>
            <span className="flex overflow-hidden relative justify-center items-center p-4 w-20 text-sm italic font-black shrink-0 bg-black/30">
                SET {setData.set}
                <IconMagicCircleDoubleBorder
                    className={`absolute -right-10 -top-1 text-white/10 ${
                        winned ? "" : "hidden"
                    }`}
                    width="144%"
                    height="144%"
                />
            </span>
            <div className="flex flex-row justify-around w-full">
                <div className="flex justify-center items-center py-2 px-4">
                    <span className="p-1 pr-1.5 italic font-extrabold rounded bg-black/30">
                        {setData.ally}
                    </span>
                </div>
                <Seperator />
                <div className="flex justify-center items-center py-2 px-4">
                    <span className="p-1 pr-1.5 italic font-extrabold rounded bg-black/30">
                        {setData.enemy}
                    </span>
                </div>
            </div>
        </div>
    );
}

function Seperator({ className }: { className?: string }) {
    return (
        <div className={`${className} min-w-min py-4`}>
            <div className="h-full w-[1px] bg-black/30"> </div>
        </div>
    );
}

function ProfileBlockInGame({
    team,
    teamSize,
}: {
    team: Team;
    teamSize: "1:1" | "2:2";
}) {
    // TODO: get from accountUUID
    const nickName = team.player1;
    const nickName2 = teamSize === "2:2" ? team.player2 : null;

    // TODO: add link to user profile page.
    return (
        <>
            <div className="flex flex-row gap-4 p-1 px-2 rounded-full hover:bg-black/20 active:bg-black/10">
                <Avatar
                    className="relative w-6 h-6 bg-white/30"
                    size={""}
                    accountUUID={team.player1}
                />
                <p>{nickName}</p>
            </div>
            {nickName2 !== null && (
                <div className="flex flex-row gap-4 p-1 px-2 rounded-full hover:bg-black/20 active:bg-black/10">
                    <Avatar
                        className="relative w-6 h-6 bg-white/30"
                        size={""}
                        accountUUID={team.player2}
                    />
                    <p>{nickName2}</p>
                </div>
            )}
        </>
    );
}
