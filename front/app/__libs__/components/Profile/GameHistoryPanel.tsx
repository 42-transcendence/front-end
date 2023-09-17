import { useMemo, useState } from "react";
import { Avatar } from "@components/Avatar";
import { Panel } from "./Panel";
import { Icon } from "@components/ImageLibrary";
import { useGameHistory, usePublicProfile } from "@hooks/useProfile";
import type { GameHistoryEntity } from "@common/generated/types";
import {
    BattleField,
    GameMode,
    type GameEarnScore,
    type GameMemberStatistics,
    type GameStatistics,
} from "@common/game-payloads";
import { ErrorPage } from "@components/Error/ErrorPage";

export function GameHistoryPanel({ accountUUID }: { accountUUID: string }) {
    const gameHistory = useGameHistory(accountUUID);

    if (gameHistory === undefined) {
        return <div className="loading">loading...</div>;
    }

    return (
        <Panel className="flex h-fit flex-col items-start justify-start gap-4 md:col-span-2 md:row-span-1 lg:h-full">
            <span className="p-4 text-xl font-extrabold text-white">전적</span>
            <div className="flex w-full flex-col gap-2 overflow-auto">
                {gameHistory.map((gameHistory) => (
                    <GameHistoryItem
                        key={gameHistory.id}
                        history={gameHistory}
                        accountId={accountUUID}
                    />
                ))}
            </div>
        </Panel>
    );
}

function GameHistoryItem({
    history,
    accountId,
}: {
    history: GameHistoryEntity;
    accountId: string;
}) {
    const [opened, setOpened] = useState(false);
    return (
        <div className="group relative flex w-full shrink-0 flex-col items-center overflow-clip rounded-xl bg-black/30 @container">
            <GameHistorySummary
                history={history}
                toggleOpen={() => setOpened(!opened)}
                accountId={accountId}
            />
            <div className={`w-full ${opened ? "flex" : "hidden"}`}>
                <GameHistoryDetail history={history} accountId={accountId} />
            </div>
        </div>
    );
}

function GameHistorySummary({
    history,
    toggleOpen,
    accountId,
}: {
    history: GameHistoryEntity;
    toggleOpen: React.ChangeEventHandler<HTMLInputElement>;
    accountId: string;
}) {
    const statistics = history.statistic as unknown as GameStatistics;
    const memberStatistics = history.memberStatistics as GameMemberStatistics[];

    const teams = useMemo(
        () =>
            [...new Set(memberStatistics.map((member) => member.team))] // member 들 정보로부터 팀의 배열 얻고, 유일하게 걸러냄
                .toSorted((a, b) => (a > b ? 1 : -1)) // 팀 이름/ 혹은 번호 정렬
                .map((team) => ({
                    team: team,
                    members: memberStatistics.filter(
                        (member) => member.team === team,
                    ),
                })),
        [memberStatistics],
    );

    const myMember = useMemo(
        () => memberStatistics.find((member) => member.accountId === accountId),
        [accountId, memberStatistics],
    );

    if (myMember === undefined) {
        return <ErrorPage />;
    }

    const winCount = statistics.earnScores.filter((scores) => {
        const myTeamScore = scores.filter(
            (score) => score.team === myMember.team,
        ).length;
        return myTeamScore > scores.length - myTeamScore;
    }).length;

    const loseCount = statistics.earnScores.length - winCount;
    const isWin = winCount > loseCount;

    return (
        <div className="flex flex-row justify-start self-stretch">
            <input
                onChange={toggleOpen}
                id={`history-${history.id}`}
                type="checkbox"
                className="hidden"
            />
            <GameModeInfo statistics={statistics} isWin={isWin} />
            <div className="flex w-full flex-row justify-around self-stretch">
                <StatScoreResult
                    winCount={winCount}
                    loseCount={loseCount}
                    isWin={isWin}
                />
                {teams.map((team) => (
                    <ItemWrapper key={team.team} className="hidden @lg:flex">
                        <ProfileBlockInGame team={team} />
                    </ItemWrapper>
                ))}
            </div>
        </div>
    );
}

function GameModeInfo({
    statistics,
    isWin,
}: {
    statistics: GameStatistics;
    isWin: boolean;
}) {
    return (
        <label
            htmlFor={`history-${statistics.gameId}`}
            className="relative flex w-28 shrink-0 flex-col items-start justify-center overflow-hidden bg-black/30 p-4 hover:bg-black/20 active:bg-black/10"
        >
            <span
                className={`w-fit rounded px-1 py-0.5 text-base font-extrabold italic ${
                    statistics.ladder ? "text-tertiary/80" : ""
                }`}
            >
                {statistics.ladder ? "QUICK" : "CUSTOM"}
            </span>

            <div className="flex w-fit shrink-0 rounded">
                <span className="w-fit shrink-0 bg-black/30 px-1 py-0.5 text-xs font-bold">
                    {statistics.params.battleField === BattleField.SQUARE
                        ? "네모네모"
                        : "동글동글"}
                </span>
                <span
                    className={`w-fit shrink-0 ${
                        statistics.params.gameMode === GameMode.UNIFORM
                            ? "bg-secondary/70"
                            : "bg-primary/70"
                    } px-1 py-0.5 text-xs font-bold `}
                >
                    {statistics.params.gameMode === GameMode.UNIFORM
                        ? "기본"
                        : "중력"}
                </span>
            </div>
            {isWin && (
                <Icon.MagicCircleComplex
                    className="absolute -left-5 -top-4 text-white/10"
                    width="144%"
                    height="144%"
                />
            )}
        </label>
    );
}

function StatScoreResult({
    winCount,
    loseCount,
    isWin,
}: {
    winCount: number;
    loseCount: number;
    isWin: boolean;
}) {
    return (
        <div className="flex flex-row items-center justify-center">
            <div className="flex w-20 flex-row justify-between px-2">
                <span className="rounded bg-black/30 p-2 text-2xl">
                    {winCount}
                </span>
                <span className="rounded bg-black/30 p-2 text-2xl">
                    {loseCount}
                </span>
            </div>
            <div className="relative flex h-full shrink-0 items-center justify-center px-2">
                <span
                    className={`flex w-16 justify-center rounded p-3 pl-2.5 text-base font-extrabold italic ${
                        isWin ? "bg-blue-500/30" : "bg-red-500/30"
                    }`}
                >
                    {isWin ? "WIN" : "LOSE"}
                </span>
            </div>
        </div>
    );
}

// function StatPlayTime({ playTime }: { playTime: string }) {
//     return (
//         <ItemWrapper className="hidden @md:flex">
//             <span className="relative flex text-base font-semibold italic">
//                 {playTime}
//             </span>
//         </ItemWrapper>
//     );
// }
//
// function StatTimeStamp({ timestamp }: { timestamp: string }) {
//     return (
//         <ItemWrapper className="hidden @lg:flex">
//             <span className="relative flex text-base font-semibold italic">
//                 {timestamp}
//             </span>
//         </ItemWrapper>
//     );
// }

// function StatRating({ history }: { history: GameHistory }) {
//     return (
//         <ItemWrapper className="hidden @2xl:flex">
//             <span className="relative flex shrink-0 text-base font-semibold italic">
//                 Rating
//             </span>
//             <span
//                 className={` ${
//                     history.config.queueType === "QUICK" ? "text-tertiary" : ""
//                 }`}
//             >
//                 {history.config.queueType === "QUICK" ? history.rating : "-"}
//             </span>
//         </ItemWrapper>
//     );
// }

function ItemWrapper({
    children,
    className,
    separatorDir = "left",
}: React.PropsWithChildren<{
    className: string;
    separatorDir?: "left" | "right" | "none";
}>) {
    return (
        <>
            {separatorDir === "left" && <Separator className={className} />}
            <div
                className={`${className} mx-1 h-full w-20 shrink-0 flex-col items-center justify-center py-4`}
            >
                {children}
            </div>
            {separatorDir === "right" && <Separator className={className} />}
        </>
    );
}

// function relativeTimePassed(date: Date): string {
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//
//     if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
//     if (diffInSeconds < 3600)
//         return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//     if (diffInSeconds < 86400)
//         return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     if (diffInSeconds < 604800)
//         return `${Math.floor(diffInSeconds / 86400)} days ago`;
//     if (diffInSeconds < 2419200)
//         return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
//
//     return date.toLocaleDateString();
// }

function GameHistoryDetail({
    history,
    accountId,
}: {
    history: GameHistoryEntity;
    accountId: string;
}) {
    const statistics = history.statistic as unknown as GameStatistics;
    const memberStatistics = history.memberStatistics as GameMemberStatistics[];

    const totalGamePlayTime =
        statistics.progresses.reduce(
            (prevSum, progress) => prevSum + progress.consumedTimespanSum,
            0,
        ) / 1000;

    const second = (totalGamePlayTime % 60).toString().padStart(2, "0");
    const min = (totalGamePlayTime / 60).toFixed();

    const myMember = useMemo(
        () => memberStatistics.find((member) => member.accountId === accountId),
        [accountId, memberStatistics],
    );

    const teams = useMemo(
        () =>
            [...new Set(memberStatistics.map((member) => member.team))] // member 들 정보로부터 팀의 배열 얻고, 유일하게 걸러냄
                .toSorted((a, b) => (a > b ? 1 : -1)) // 팀 이름/ 혹은 번호 정렬
                .map((team) => ({
                    team: team,
                    members: memberStatistics.filter(
                        (member) => member.team === team,
                    ),
                })),
        [memberStatistics],
    );

    if (myMember === undefined) {
        return <ErrorPage />;
    }
    // const relativeDate = relativeTimePassed(statistics.timestamp);

    return (
        <div className="flex w-full flex-col items-start justify-center">
            <div className="flex h-20 w-full flex-row items-center justify-start bg-secondary/10 @lg:hidden">
                <div className="flex h-full w-28 shrink-0 flex-col items-center justify-center bg-black/30">
                    <span className="rounded px-1 py-0.5 text-base font-extrabold italic">
                        Player
                    </span>
                </div>

                <div className="flex h-full w-full flex-row justify-around">
                    <ProfileBlockInGame team={teams[0]} />

                    <Separator className="flex" />

                    <ProfileBlockInGame team={teams[1]} />
                </div>
            </div>

            <div className="flex w-full flex-col">
                {statistics.earnScores.map((oneSet, index) => (
                    <SetScore
                        setData={oneSet}
                        key={index}
                        index={index}
                        myTeam={myMember.team}
                    />
                ))}
            </div>

            <div className="flex w-full flex-row bg-primary/10">
                <div className="flex h-full w-28 shrink-0 flex-col items-center justify-center bg-black/30 py-4">
                    <span className="relative flex shrink-0 text-sm font-semibold italic">
                        Statistics
                    </span>
                </div>

                <ItemWrapper separatorDir="right" className="flex @md:hidden">
                    <span className="relative flex text-sm font-semibold italic">
                        {min}:{second}
                    </span>
                </ItemWrapper>

                {/* <ItemWrapper separatorDir="right" className={"flex @lg:hidden"}>
                    <span className="relative flex text-sm font-semibold italic">
                        {relativeDate}
                    </span>
                </ItemWrapper> */}

                <ItemWrapper
                    separatorDir="none"
                    className="hidden @md:flex @2xl:hidden"
                >
                    <span className="relative flex shrink-0 text-sm font-semibold italic">
                        Rating
                    </span>
                    <span
                        className={` ${
                            statistics.ladder ? "text-tertiary" : ""
                        }`}
                    >
                        {memberStatistics.length === 0
                            ? "-"
                            : memberStatistics.reduce(
                                  (prev, member) =>
                                      prev + (member.initialSkillRating ?? 0),
                                  0,
                              ) / memberStatistics.length}
                    </span>
                </ItemWrapper>
            </div>
        </div>
    );
}

function SetScore({
    setData,
    index,
    myTeam,
}: {
    setData: GameEarnScore[];
    index: number;
    myTeam: number;
}) {
    const winCount = setData.filter((score) => score.team === myTeam).length;

    const winned = winCount > setData.length - winCount;

    return (
        <div className={`flex w-full ${winned && "bg-black/10"}`}>
            <span className="relative flex w-28 shrink-0 items-center justify-center overflow-hidden bg-black/30 p-4 text-sm font-black italic">
                SET {index + 1}
                <Icon.MagicCircleDoubleBorder
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
                        {winCount}
                    </span>
                </div>
                <Separator />
                <div className="flex items-center justify-center px-4 py-2">
                    <span className="rounded p-1 pr-1.5 text-xl font-extrabold italic">
                        {setData.length - winCount}
                    </span>
                </div>
            </div>
        </div>
    );
}

function ProfileItemMinimal({ accountId }: { accountId: string }) {
    const profile = usePublicProfile(accountId);
    const nickName = profile?.nickName ?? "...";

    return (
        <div
            title={nickName}
            className="flex flex-row gap-4 rounded-full p-1 px-2 hover:bg-black/20 active:bg-black/10"
        >
            <Avatar
                className="relative h-6 w-6 bg-white/30"
                accountUUID={accountId}
                privileged={false}
            />
            <span className="line-clamp-1 w-20 font-sans font-medium text-gray-50 @lg:hidden @2xl:line-clamp-1">
                {nickName}
            </span>
        </div>
    );
}

export function Separator({ className }: { className?: string | undefined }) {
    return (
        <div className={`${className} min-w-min py-4`}>
            <div className="h-full w-[1px] bg-white/30"> </div>
        </div>
    );
}

function ProfileBlockInGame({
    team,
}: {
    team: {
        team: number;
        members: GameMemberStatistics[];
    };
}) {
    return (
        <div className="flex flex-col items-start justify-center @2xl:items-center">
            {team.members.map((member) => (
                <ProfileItemMinimal
                    key={member.accountId}
                    accountId={member.accountId}
                />
            ))}
        </div>
    );
}
