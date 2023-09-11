"use client";

import type { ChatDirectEntry, ChatRoomEntry } from "@common/chat-payloads";
import type { RightSideBarContents } from "@components/Chat/ChatRightSideBar";
import { atom } from "jotai";

export const CreateNewRoomCheckedAtom = atom(false);

export const ChatRoomListAtom = atom(Array<ChatRoomEntry>());
export const DirectRoomListAtom = atom(Array<ChatDirectEntry>());

export const CurrentChatRoomUUIDAtom = atom("");

export const LeftSideBarIsOpenAtom = atom(
    (get) => ({
        open: get(_backing_LeftSideBarOpenInputAtom),
        close: get(_backing_LeftSideBarCloseInputAtom),
    }),
    (_, set, isOpen: boolean) => {
        set(_backing_LeftSideBarOpenInputAtom, isOpen);
        set(_backing_LeftSideBarCloseInputAtom, !isOpen);
    },
);

export const ChatModalOpenAtom = atom(false);
export const ChatTabIndexAtom = atom(1);

export const ChatRightSideBarCurrrentPage =
    atom<RightSideBarContents>(undefined);

const _backing_LeftSideBarOpenInputAtom = atom(false);
const _backing_LeftSideBarCloseInputAtom = atom(true);
