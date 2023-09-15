"use client";

import type { GameMemberParams } from "@common/game-payloads";
import { atom } from "jotai";

export const InvitationAtom = atom("");
export const IsMatchMakingAtom = atom(false);

export const ParticipantsUUIDAtom = atom(Array<string>());
export const GameReadyAtom = atom(false);
export const GameMemberAtom = atom(Array<GameMemberParams>());
