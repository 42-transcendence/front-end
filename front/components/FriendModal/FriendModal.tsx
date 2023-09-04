"use client";

import { useState } from "react";
import { ProfileItem } from "@/components/ProfileItem";
import { Avatar } from "../Avatar";
import { Icon } from "../ImageLibrary";
import { Provider, createStore, useAtomValue } from "jotai";
import { FriendEntryAtom, FriendRequestEntryAtom } from "@/atom/FriendAtom";
import { useWebSocket } from "@/library/react/websocket-hook";
import { ByteBuffer } from "@/library/akasha-lib";
import { ChatServerOpcode } from "@/library/payload/chat-opcodes";
import { TargetedAccountUUIDAtom } from "@/atom/AccountAtom";
import { usePublicProfile } from "@/hooks/useProfile";

export function FriendModal() {
    //TODO: fetch profile datas
    const { sendPayload } = useWebSocket("chat", []);

    return (
        <div className="gradient-border relative flex w-[262px] flex-col items-start rounded-[28px] bg-windowGlass/30 p-px backdrop-blur-[20px] backdrop-brightness-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:p-px before:content-['']">
            <div className="w-full overflow-clip rounded-[28px] ">
                <InviteList />
                <FriendList />
                <div
                    className={"relative flex h-fit w-full shrink-0 flex-col items-start"}
                >
                    <div
                        className="group relative flex w-full flex-row items-center space-x-4 self-stretch rounded p-4 text-gray-300 hover:bg-primary/30"
                        onClick={() => {
                            //TODO: UUID 대신 닉네임으로도 할 수 있게?
                            const nickNameTag = prompt("UUID 입력? 하시오?");

                            if (nickNameTag !== null) {
                                const buf = ByteBuffer.createWithOpcode(
                                    ChatServerOpcode.ADD_FRIEND,
                                );
                                buf.writeUUID(nickNameTag);
                                buf.writeString("기본 그룹"); //TODO: 으악
                                buf.write1(3); //TODO: activeFlags
                                sendPayload(buf);
                            }
                        }}
                    >
                        <Icon.Plus />
                        <p className="text-normal text-xs">친구 추가하기?</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FriendList() {
    const friendEntrySet = useAtomValue(FriendEntryAtom);
    const [selectedUUID, setSelectedUUID] = useState<string>();

    return friendEntrySet.map((friend) => (
        <ProfileItem
            type="friend"
            key={friend.uuid}
            accountUUID={friend.uuid}
            selected={friend.uuid === selectedUUID}
            onClick={() => {
                setSelectedUUID(
                    friend.uuid !== selectedUUID ? friend.uuid : undefined,
                );
            }}
        />
    ));
}

// TODO: @/components/Service/InviteList 와 이름 겹침
function InviteList() {
    const friendRequestUUIDs = useAtomValue(FriendRequestEntryAtom);

    return (
        friendRequestUUIDs.length !== 0 && (
            <div className="flex flex-col gap-2 py-2">
                <InviteHeader />
                {friendRequestUUIDs.map((accountUUID) => (
                    <InviteItem key={accountUUID} accountUUID={accountUUID} />
                ))}
                <div className="mx-4 h-[1px] bg-white/30" />
            </div>
        )
    );
}

function InviteItem({ accountUUID }: { accountUUID: string }) {
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
                            const response = ByteBuffer.createWithOpcode(
                                ChatServerOpcode.ADD_FRIEND,
                            );
                            response.writeUUID(accountUUID);
                            response.writeString("기본 그룹"); //TODO: 으악
                            response.write1(3); //TODO: activeFlags
                            sendPayload(response);
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
                            const response = ByteBuffer.createWithOpcode(
                                ChatServerOpcode.DELETE_FRIEND,
                            );
                            response.writeUUID(accountUUID);
                            sendPayload(response);
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

function InviteHeader() {
    return (
        <div className="flex flex-col justify-start">
            <span className="p-4 text-base font-extrabold  text-white/90">
                친구 요청
            </span>
        </div>
    );
}
