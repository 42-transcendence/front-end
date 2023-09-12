"use client";

import { useCallback, useId, useState } from "react";
import { ProfileItem } from "@components/ProfileItem";
import { Avatar } from "../Avatar";
import { Icon } from "../ImageLibrary";
import { Provider, createStore, useAtomValue } from "jotai";
import { FriendEntryListAtom, FriendRequestListAtom } from "@atoms/FriendAtom";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { TargetedAccountUUIDAtom } from "@atoms/AccountAtom";
import type { TypeWithProfile } from "@hooks/useProfile";
import { useProtectedProfiles, usePublicProfile } from "@hooks/useProfile";
import { GlassWindow } from "@components/Frame/GlassWindow";
import { NICK_NAME_REGEX } from "@common/profile-constants";
import {
    makeAddFriendRequest,
    makeDeleteFriendRequest,
} from "@akasha-utils/chat-payload-builder-client";
import type { FriendEntry } from "@common/chat-payloads";
import type { AccountProfileProtectedPayload } from "@common/profile-payloads";
import { getActiveStatusOrder } from "@common/auth-payloads";

const nickTagSeparator = "#";

export function FriendModal() {
    const { sendPayload } = useWebSocket("chat", []);
    const sendFriendRequest = () => {
        const input = prompt("[닉네임#태그]를 입력해주세요");
        if (input === null) {
            return;
        }

        const separator = input.indexOf(nickTagSeparator);
        if (separator === -1) {
            alert("입력 형식을 확인해주세요");
            return;
        }

        const nickName = input.slice(0, separator);
        const nickTagStr = input.slice(separator + 1);

        if (!NICK_NAME_REGEX.test(nickName)) {
            alert("입력 형식을 확인해주세요");
            return;
        }
        const nickTag = Number(nickTagStr);
        if (Number.isNaN(nickTag)) {
            alert("입력 형식을 확인해주세요");
            return;
        }

        sendPayload(
            makeAddFriendRequest({ nickName, nickTag }, "", 0b11111111),
        );
    };

    return (
        <GlassWindow>
            <div className="w-full overflow-clip rounded-[28px] ">
                <FriendRequestList />
                <FriendList />
                <div className="relative flex h-fit w-full shrink-0 flex-col items-start">
                    <div
                        className="group relative flex w-full flex-row items-center space-x-4 self-stretch rounded p-4 text-gray-300 hover:bg-primary/30"
                        onClick={sendFriendRequest}
                    >
                        <Icon.Plus />
                        <p className="text-normal text-xs">친구 추가하기</p>
                    </div>
                </div>
            </div>
        </GlassWindow>
    );
}

// TODO: 파일로 옮길것
type ProtectedFriendCompareType = TypeWithProfile<
    FriendEntry,
    AccountProfileProtectedPayload
>;

function compareProtectedFriendEntry(
    e1: ProtectedFriendCompareType,
    e2: ProtectedFriendCompareType,
) {
    const profile1 = e1._profile;
    const profile2 = e2._profile;

    if (profile1 === undefined) return -1;
    if (profile2 === undefined) return 1;

    if (profile1.activeStatus !== profile2.activeStatus) {
        return getActiveStatusOrder(profile1.activeStatus) >
            getActiveStatusOrder(profile2.activeStatus)
            ? -1
            : 1;
    }

    const nick1 = profile1.nickName ?? "";
    const nick2 = profile2.nickName ?? "";

    if (nick1 !== nick2) {
        return nick1 > nick2 ? 1 : -1;
    }

    return profile1.nickTag > profile2.nickTag ? 1 : -1;
}

function FriendList() {
    const friendEntrySet = useAtomValue(FriendEntryListAtom);
    const [selectedUUID, setSelectedUUID] = useState<string>();
    const friendProfiles = useProtectedProfiles(
        useId(),
        friendEntrySet,
        useCallback((e: FriendEntry) => e.friendAccountId, []),
    );

    if (friendProfiles === undefined) {
        return null;
    }

    return friendProfiles
        .toSorted((e1, e2) => compareProtectedFriendEntry(e1, e2))
        .map((friend) => (
            <ProfileItem
                type="FriendModal"
                key={friend.friendAccountId}
                accountUUID={friend.friendAccountId}
                selected={friend.friendAccountId === selectedUUID}
                onClick={() => {
                    setSelectedUUID(
                        friend.friendAccountId !== selectedUUID
                            ? friend.friendAccountId
                            : undefined,
                    );
                }}
            />
        ));
}

function FriendRequestList() {
    const friendRequestUUIDs = useAtomValue(FriendRequestListAtom);

    return (
        friendRequestUUIDs.length !== 0 && (
            <div className="flex flex-col gap-2 py-2">
                <FriendRequestListHeader />
                {friendRequestUUIDs.map((accountUUID) => (
                    <FriendRequestItem
                        key={accountUUID}
                        accountUUID={accountUUID}
                    />
                ))}
                <div className="mx-4 h-[1px] bg-white/30" />
            </div>
        )
    );
}

function FriendRequestItem({ accountUUID }: { accountUUID: string }) {
    const store = createStore();
    store.set(TargetedAccountUUIDAtom, accountUUID);

    const { sendPayload } = useWebSocket("chat", []);
    const profile = usePublicProfile(accountUUID);
    //TODO: add suspend skeleton;
    //TODO: refactor profile part

    return (
        <Provider store={store}>
            <div className="flex flex-row justify-between px-4 py-2 hover:bg-primary/30">
                <div className="flex flex-row gap-2">
                    <div className="relative flex items-center justify-center">
                        <Avatar
                            className="h-10 w-10"
                            accountUUID={accountUUID}
                            privileged={false}
                        />
                    </div>
                    <div className="relative flex w-fit flex-col items-start justify-center gap-1">
                        <p className="relative w-fit select-none whitespace-nowrap font-sans text-base font-bold leading-none tracking-normal text-gray-50">
                            {profile?.nickName}
                        </p>
                        <p className="relative w-fit select-none whitespace-nowrap font-sans text-xs font-normal leading-none tracking-normal text-gray-300/60">
                            {profile?.nickTag}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 px-4">
                    <button
                        onClick={() => {
                            sendPayload(
                                makeAddFriendRequest(accountUUID, "", 255),
                            );
                        }}
                    >
                        <Icon.Check
                            width={24}
                            height={24}
                            className="rounded-full bg-green-500 p-1.5 text-white/90"
                        />
                    </button>
                    <button
                        onClick={() => {
                            sendPayload(makeDeleteFriendRequest(accountUUID));
                        }}
                    >
                        <Icon.X
                            width={24}
                            height={24}
                            className="rounded-full bg-red-500 p-1.5 text-white/90"
                        />
                    </button>
                </div>
            </div>
        </Provider>
    );
}

function FriendRequestListHeader() {
    return (
        <div className="flex flex-col justify-start">
            <span className="p-4 text-base font-extrabold  text-white/90">
                친구 요청
            </span>
        </div>
    );
}
