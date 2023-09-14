"use client";

import { atom } from "jotai";

export const InvitationAtom = atom("");
export const IsMatchMakingAtom = atom(false);

export const ParticipantsUUIDAtom = atom(Array<string>());
export const GameReadyAtom = atom(false);
