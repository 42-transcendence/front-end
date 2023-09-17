"use client";

import { GameMemberStatisticsAtom, GameStatisticsAtom } from "@atoms/GameAtom";
import type {
    GameMemberStatistics,
    GameStatistics,
} from "@common/game-payloads";
import { GameOutcome } from "@common/game-payloads";
import { Avatar } from "@components/Avatar";
import { ErrorPage } from "@components/Error/ErrorPage";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { Icon } from "@components/ImageLibrary";
import { NickBlock } from "@components/ProfileItem/ProfileItem";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useCallback, useMemo } from "react";

function GamePanel({ children }: { children: React.ReactNode }) {
    return <div className="flex w-full flex-row gap-4">{children}</div>;
}

export function AfterGamePage() {
    const gameResult = useAtomValue(GameStatisticsAtom);
    const gameMemberResult = useAtomValue(GameMemberStatisticsAtom);
    const currentAccountUUID = useCurrentAccountUUID();
    const teams = useMemo(
        () =>
            [...new Set(gameMemberResult.map((member) => member.team))] // member 들 정보로부터 팀의 배열 얻고, 유일하게 걸러냄
                .toSorted((a, b) => (a > b ? 1 : -1)) // 팀 이름/ 혹은 번호 정렬
                .map((team) => ({
                    team: team,
                    members: gameMemberResult.filter(
                        (member) => member.team === team,
                    ),
                })),
        [gameMemberResult],
    );

    const myMember = useMemo(
        () =>
            gameMemberResult.find(
                (member) => member.accountId === currentAccountUUID,
            ),
        [currentAccountUUID, gameMemberResult],
    );

    const teamResult = useCallback((result: GameStatistics, team: number) => {
        const set = result.earnScores.map(
            (scoresOfEachSet) =>
                scoresOfEachSet.filter((score) => score.team === team).length,
        );
        const total = set.reduce((prev, curr) => prev + curr, 0);

        return { total, set };
    }, []);

    if (myMember === undefined || gameResult === null) {
        return <ErrorPage />;
    }

    const isWin = myMember.outcome === GameOutcome.WIN;

    const totalGamePlayTime =
        gameResult.progresses.reduce(
            (prevSum, progress) => prevSum + progress.consumedTimespanSum,
            0,
        ) / 1000;

    const second = (totalGamePlayTime % 60).toString().padStart(2, "0");
    const min = (totalGamePlayTime / 60).toFixed();

    return (
        <div className="flex h-full w-full flex-col items-center justify-start lg:p-16">
            <GlassWindow className="h-full w-full bg-windowGlass/30">
                <div className="flex h-full w-full flex-col justify-between p-8">
                    <div className="flex h-full w-full flex-col gap-4">
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
                            <SetFrame className="items-start gap-2 pl-8">
                                <TeamResult
                                    team={teamResult(gameResult, teams[0].team)}
                                />
                            </SetFrame>
                            <SetFrame className="items-center gap-2">
                                {gameResult.earnScores.map((_, index) => (
                                    <span
                                        key={index}
                                        className="rounded-lg bg-black/30 p-4 text-2xl font-black italic text-white"
                                    >
                                        SET {index + 1}
                                    </span>
                                ))}
                            </SetFrame>
                            <SetFrame className="items-end gap-2 pr-8">
                                <TeamResult
                                    team={teamResult(gameResult, teams[1].team)}
                                />
                            </SetFrame>
                        </GamePanel>
                        <GamePanel>
                            {teams.map((team) => (
                                <MembersSection key={team.team} team={team} />
                            ))}
                        </GamePanel>
                    </div>
                    <div className="flex w-full justify-center">
                        <Link
                            className="flex flex-row items-center justify-center gap-3 rounded bg-secondary/50 p-3 hover:bg-secondary/60 active:bg-secondary/70"
                            href="/"
                        >
                            <Icon.Arrow3 />
                            홈으로 돌아가기
                        </Link>
                    </div>
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
    team,
}: {
    team: {
        team: number;
        members: GameMemberStatistics[];
    };
}) {
    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-black/30 p-4">
            {Object.values(team.members).map((member) => {
                return <MemberSection key={member.accountId} member={member} />;
            })}
        </div>
    );
}

function MemberSection({ member }: { member: GameMemberStatistics }) {
    const delta =
        (member.finalSkillRating ?? 0) - (member.initialSkillRating ?? 0);
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
                    {member.finalSkillRating}
                </span>
                <div className="flex gap-1">
                    {member.initialSkillRating}
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
    return team.set.map((score, index) => (
        <span
            className="rounded-lg bg-black/30 p-4 pr-5 text-2xl italic"
            key={index}
        >
            {score}
        </span>
    ));
}
