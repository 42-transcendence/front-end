import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Panel } from "./Panel";
import {
    IconExternalWindow,
    IconMagicCircleComplex,
    IconMagicCircleDoubleBorder,
} from "@/components/ImageLibrary";

type AccountUUID = string;

type Team = {
    player1: AccountUUID;
    player2?: AccountUUID;
};

type SetData = {
    set: number;
    ally: number;
    enemy: number;
    mvp: AccountUUID;
};

type GameConfig = {
    queueType: "CUSTOM" | "QUICK";
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
    set: SetData[];
    config: GameConfig;
    statistics: GameStatistics;
    gameUUID: string;
    rating: number;
};

const GameHistoryMockup: GameHistory[] = [
    {
        gameUUID: "1",
        rating: 1231,
        ally: {
            player1: "한글로여덟자히히",
            player2: "456",
        },
        enemy: {
            player1: "1231123a",
            player2: "456",
        },
        set: [
            { set: 1, ally: 3, enemy: 2, mvp: "jisookim" },
            { set: 2, ally: 2, enemy: 3, mvp: "jisookim" },
            { set: 3, ally: 3, enemy: 2, mvp: "jisookim" },
            { set: 4, ally: 2, enemy: 3, mvp: "jisookim" },
            { set: 5, ally: 3, enemy: 2, mvp: "jisookim" },
        ],
        config: {
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
            { set: 1, ally: 2, enemy: 3, mvp: "jisookim" },
            { set: 2, ally: 1, enemy: 3, mvp: "jisookim" },
            { set: 3, ally: 3, enemy: 1, mvp: "jisookim" },
            { set: 4, ally: 2, enemy: 2, mvp: "jisookim" },
        ],
        config: {
            queueType: "QUICK",
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
            { set: 1, ally: 3, enemy: 2, mvp: "jisookim" },
            { set: 2, ally: 3, enemy: 1, mvp: "jisookim" },
        ],
        config: {
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
            { set: 1, ally: 2, enemy: 3, mvp: "jisookim" },
            { set: 2, ally: 1, enemy: 3, mvp: "jisookim" },
        ],
        config: {
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
            { set: 1, ally: 3, enemy: 0, mvp: "jisookim" },
            { set: 2, ally: 2, enemy: 1, mvp: "jisookim" },
        ],
        config: {
            queueType: "QUICK",
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
            { set: 1, ally: 1, enemy: 3, mvp: "jisookim" },
            { set: 2, ally: 2, enemy: 2, mvp: "jisookim" },
        ],
        config: {
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
            { set: 1, ally: 3, enemy: 2, mvp: "jisookim" },
            { set: 2, ally: 1, enemy: 3, mvp: "jisookim" },
            { set: 3, ally: 2, enemy: 3, mvp: "jisookim" },
        ],
        config: {
            queueType: "QUICK",
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
            { set: 1, ally: 2, enemy: 1, mvp: "jisookim" },
            { set: 2, ally: 2, enemy: 3, mvp: "jisookim" },
            { set: 3, ally: 3, enemy: 0, mvp: "jisookim" },
        ],
        config: {
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
            { set: 1, ally: 1, enemy: 3, mvp: "jisookim" },
            { set: 2, ally: 3, enemy: 1, mvp: "jisookim" },
            { set: 3, ally: 1, enemy: 3, mvp: "jisookim" },
        ],
        config: {
            queueType: "QUICK",
            mode: "기본",
            field: "네모네모",
        },
        statistics: {
            startTimeStamp: "7 days ago",
            playTime: "11m 30s",
        },
    },
];

export function GameHistoryPanel({ accountUUID }: { accountUUID: string }) {
    return (
        <>
            <input
                type="checkbox"
                className="peer hidden"
                id="GameHistoryPanel"
            />
            <Panel
                className={`flex h-full flex-col items-start justify-start overflow-clip peer-checked:h-fit md:col-span-2 md:row-span-1`}
            >
                <label
                    htmlFor="GameHistoryPanel"
                    className="z-10 flex w-full flex-row items-center justify-between p-4"
                >
                    <span className="text-xl font-extrabold text-white">
                        전적
                    </span>
                </label>
                <div className="flex w-full flex-col gap-2 overflow-auto">
                    {/* TODO: key 를 gameUUID 로? */}
                    {GameHistoryMockup.map((gameHistory, index) => (
                        <GameHistoryItem key={index} history={gameHistory} />
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
                className="peer hidden"
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
            <label
                htmlFor={history.gameUUID}
                className="relative flex w-28 shrink-0 flex-col items-start justify-center overflow-hidden bg-black/30 p-4 hover:bg-black/20 active:bg-black/10"
            >
                <span
                    className={`w-fit rounded px-1 py-0.5 text-base font-extrabold italic ${
                        history.config.queueType === "QUICK"
                            ? "text-tertiary/80"
                            : ""
                    }`}
                >
                    {history.config.queueType}
                </span>

                <div className="flex w-fit shrink-0 rounded">
                    <span className="w-fit shrink-0 bg-black/30 px-1 py-0.5 text-xs font-bold">
                        {history.config.field}
                    </span>
                    <span
                        className={`w-fit shrink-0 ${
                            history.config.mode === "기본"
                                ? "bg-secondary/70"
                                : "bg-primary/70"
                        } px-1 py-0.5 text-xs font-bold `}
                    >
                        {history.config.mode}
                    </span>
                </div>
                <IconMagicCircleComplex
                    className={`absolute -left-5 -top-4 text-white/10 ${
                        gameResult === "WIN" ? "" : "hidden"
                    }`}
                    width="144%"
                    height="144%"
                />
            </label>

            <div className="flex w-full flex-row justify-around self-stretch">
                <div className="flex flex-row items-center justify-center">
                    <div className="flex flex-row gap-2 px-4">
                        <span className="rounded bg-black/30 p-2 text-2xl">
                            {winCount}
                        </span>
                        <span className="rounded bg-black/30 p-2 text-2xl">
                            {loseCount}
                        </span>
                    </div>
                    <Seperator />
                    <div className="relative flex h-full shrink-0 items-center justify-center px-4">
                        <span
                            className={`flex w-16 justify-center rounded p-3 pl-2.5 text-base font-extrabold italic ${
                                gameResult === "WIN"
                                    ? "bg-blue-500/30"
                                    : "bg-red-500/30"
                            }`}
                        >
                            {gameResult}
                        </span>
                    </div>
                </div>

                <ItemWrapper className="hidden @md:flex">
                    <span className="relative flex text-sm font-semibold italic">
                        {history.statistics.playTime}
                    </span>
                </ItemWrapper>

                <ItemWrapper className="hidden @lg:flex">
                    <span className="relative flex text-sm font-semibold italic">
                        {history.statistics.startTimeStamp}
                    </span>
                </ItemWrapper>

                <ItemWrapper className="hidden @2xl:flex">
                    <span className="relative flex shrink-0 text-sm font-semibold italic">
                        Rating
                    </span>
                    <span
                        className={` ${
                            history.config.queueType === "QUICK"
                                ? "text-tertiary"
                                : ""
                        }`}
                    >
                        {history.config.queueType === "QUICK"
                            ? history.rating
                            : "-"}
                    </span>
                </ItemWrapper>
            </div>
        </div>
    );
}

function ItemWrapper({
    children,
    className,
    seperatorDir = "left",
}: React.PropsWithChildren<{
    className: string;
    seperatorDir?: "left" | "right" | "none";
}>) {
    return (
        <>
            {seperatorDir === "left" && (
                <Seperator className={className} />
            )}
            <div
                className={`${className} mx-1 h-full w-20 shrink-0 flex-col items-center justify-center py-4`}
            >
                {children}
            </div>
            {seperatorDir === "right" && (
                <Seperator className={className} />
            )}
        </>
    );
}

function GameHistoryDetail({ history }: { history: GameHistory }) {
    return (
        <div className="flex w-full flex-col items-start justify-center">
            <div className="flex h-20 w-full flex-row items-center justify-start bg-secondary/10">
                <div className="flex h-full w-28 shrink-0 flex-col items-center justify-center bg-black/30">
                    <span className="rounded px-1 py-0.5 text-sm font-extrabold italic">
                        Player
                    </span>
                </div>

                <div className="flex h-full w-full flex-row justify-around">
                    <ProfileBlockInGame team={history.ally} />

                    <Seperator className="flex" />

                    <ProfileBlockInGame team={history.enemy} />
                </div>
            </div>

            <div className="flex w-full flex-col">
                {history.set.map((oneSet, index) => (
                    <SetScore setData={oneSet} key={index} />
                ))}
            </div>

            <div className="flex w-full flex-row bg-primary/10">
                <div className="flex h-full w-28 shrink-0 flex-col items-center justify-center bg-black/30 py-4">
                    <span className="relative flex shrink-0 text-sm font-semibold italic">
                        Statistics
                    </span>
                </div>

                <ItemWrapper seperatorDir="right" className="flex @md:hidden">
                    <span className="relative flex text-sm font-semibold italic">
                        {history.statistics.playTime}
                    </span>
                </ItemWrapper>

                <ItemWrapper seperatorDir="right" className={"flex @lg:hidden"}>
                    <span className="relative flex text-sm font-semibold italic">
                        {history.statistics.startTimeStamp}
                    </span>
                </ItemWrapper>

                <ItemWrapper
                    seperatorDir="right"
                    className="hidden @md:flex @2xl:hidden"
                >
                    <span className="relative flex shrink-0 text-sm font-semibold italic">
                        Rating
                    </span>
                    <span
                        className={` ${
                            history.config.queueType === "QUICK"
                                ? "text-tertiary"
                                : ""
                        }`}
                    >
                        {history.config.queueType === "QUICK"
                            ? history.rating
                            : "-"}
                    </span>
                </ItemWrapper>

                <div className="flex w-full items-center justify-center py-4">
                    <div className="flex w-fit flex-row rounded-md text-gray-50/80 hover:bg-primary/30 active:bg-secondary/50">
                        <IconExternalWindow
                            width={48}
                            height={48}
                            className="p-3"
                        />
                        <span className="hidden p-3 @2xl:flex">
                            상세 페이지로 이동
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SetScore({ setData }: { setData: SetData }) {
    const winned = setData.ally > setData.enemy;

    return (
        <div className={`flex w-full ${winned && "bg-black/10"}`}>
            <span className="relative flex w-28 shrink-0 items-center justify-center overflow-hidden bg-black/30 p-4 text-sm font-black italic">
                SET {setData.set}
                <IconMagicCircleDoubleBorder
                    className={`absolute -right-10 -top-1 text-white/10 ${
                        winned ? "" : "hidden"
                    }`}
                    width="144%"
                    height="144%"
                />
            </span>
            <div className="flex w-full flex-row justify-around">
                <div className="flex items-center justify-center px-4 py-2">
                    <span className="rounded p-1 pr-1.5 text-xl font-extrabold italic">
                        {setData.ally}
                    </span>
                </div>
                <Seperator />
                <div className="flex items-center justify-center px-4 py-2">
                    <span className="rounded p-1 pr-1.5 text-xl font-extrabold italic">
                        {setData.enemy}
                    </span>
                </div>
                <Seperator />
                <div className="flex flex-col items-center justify-center p-3">
                    <span className="rounded p-1 pr-1.5 font-extrabold italic text-tertiary/80">
                        MVP
                    </span>
                    <ProfileItemMinimal accountUUID={setData.mvp} />
                </div>
            </div>
        </div>
    );
}

function ProfileItemMinimal({ accountUUID }: { accountUUID: AccountUUID }) {
    // TODO: fetch from accountUUID
    const nickName = accountUUID;

    return (
        <div
            title={nickName}
            className="flex flex-row gap-4 rounded-full p-1 px-2 hover:bg-black/20 active:bg-black/10"
        >
            <Avatar
                className="relative h-6 w-6 bg-white/30"
                size={""}
                accountUUID={accountUUID}
            />
            <span className="line-clamp-1 font-sans font-medium text-gray-50 @lg:block">
                {nickName}
            </span>
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

function ProfileBlockInGame({ team }: { team: Team }) {
    // TODO: get from accountUUID

    // TODO: add link to user profile page.
    return (
        <div className="flex flex-col items-start justify-center py-2 @2xl:flex-row @2xl:items-center @2xl:gap-4">
            <ProfileItemMinimal accountUUID={team.player1} />
            {team.player2 !== undefined && (
                <ProfileItemMinimal accountUUID={team.player2} />
            )}
        </div>
    );
}
