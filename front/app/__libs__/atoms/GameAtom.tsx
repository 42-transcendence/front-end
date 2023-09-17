"use client";

import type {
    GameMemberParams,
    GameMemberStatistics,
    GameProgress,
    GameRoomParams,
    GameRoomProps,
    GameStatistics,
} from "@common/game-payloads";
import { atom } from "jotai";

export const InvitationAtom = atom("");
export const IsMatchMakingAtom = atom(false);

export const ParticipantsUUIDAtom = atom(Array<string>());
export const GameReadyAtom = atom(false);
export const GameMemberAtom = atom(Array<GameMemberParams>());
export const GameRoomPropsAtom = atom<GameRoomProps | null>(null);
export const GameRoomParamsAtom = atom<GameRoomParams | null>(null);
export const LadderAtom = atom(false);

export const GameProgressAtom = atom<GameProgress | null>(null);
export const GameStatisticsAtom = atom<GameStatistics | null>(null);
export const GameMemberStatisticsAtom = atom<GameMemberStatistics[]>([]);
