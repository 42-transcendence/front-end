"use client";

import { useState } from "react";
import { Icon } from "@/components/ImageLibrary";
import { TextField } from "@/components/TextField";
import { ProfileItem } from "@/components/ProfileItem";
import { InviteList } from "@/components/Service/InviteList";
import { ButtonOnRight } from "../Button/ButtonOnRight";
import { ChatAccessBanList, ChatCommitBanList } from "./ChatBanList";
import { MenuItem } from "./MenuItem";
import { AccessBan } from "./NewBan";
import { Provider, useAtomValue } from "jotai";
import { SelectedAccountUUIDsAtom } from "@/atom/AccountAtom";
import { useWebSocket } from "@/library/react/websocket-hook";
import {
    ChatClientOpcode,
    ChatServerOpcode,
} from "@/library/payload/chat-opcodes";
import { ByteBuffer } from "@/library/akasha-lib";
import {
    CurrentChatMembersAtom,
    CurrentChatRoomUUIDAtom,
} from "@/atom/ChatAtom";
import { GlobalStore } from "@/atom/GlobalStore";

import { useFzf } from "react-fzf";

export type RightSideBarContents =
    | "report"
    | "newCommitBan"
    | "newAccessBan"
    | "commitBanMemberList"
    | "accessBanMemberList"
    | undefined;

// TODO: displaytitle을 front-end에서 직접 정하는게 아니라, 백엔드에서 없으면
// 동일 로직으로 타이틀을 만들어서 프론트에 넘겨주고, 프론트에선 타이틀을 항상
// 존재하는 프로퍼티로 추후 변경할 수도
// TODO: refactoring 하고 어떻게 잘 함수 분리해보기

export default function ChatRightSideBar() {
    const [selectedUUID, setSelectedUUID] = useState<string>();
    const [query, setQuery] = useState("");
    const currentChatMembers = useAtomValue(CurrentChatMembersAtom);
    const { results: foundCurrentChatMembers } = useFzf({
        items: currentChatMembers,
        itemToString(item) {
            //TODO: fetch...? Fzf 지우기가 먼저인가? (2) 같은 문제가 InviteList에도 있으니 반드시 참조 바람
            return item.uuid;
        },
        limit: 5,
        query,
    });
    const [inviteToggle, setInviteToggle] = useState(false);
    // TODO: setAdmin logic
    const [admin, setAdmin] = useState(true);
    const [currentPage, setCurrentPage] = useState<RightSideBarContents>();
    const [memberListDropDown, setMemberListDropDown] = useState(false);

    const handleList = () => {
        setMemberListDropDown(!memberListDropDown);
        if (currentPage !== undefined) {
            setInviteToggle(false);
            setCurrentPage(undefined);
            setMemberListDropDown(false);
        }
    };

    const pageTitle = (currentContent: RightSideBarContents) => {
        switch (currentContent) {
            case "accessBanMemberList":
                return "차단 유저 목록";
            case "commitBanMemberList":
                return "채팅금지 유저 목록";
            case "newCommitBan":
                return "채팅 금지";
            case "newAccessBan":
                return "내보내기";
            default:
                return "멤버 목록";
        }
    };

    const memberList = inviteToggle ? (
        <Provider>
            <InviteForm />
        </Provider>
    ) : (
        <>
            <TextField
                type="search"
                icon={
                    <Icon.Search
                        className="absolute left-1 right-1 top-1 select-none rounded-lg p-1 transition-all group-focus-within:left-[15.5rem] group-focus-within:bg-secondary group-focus-within:text-white"
                        width={24}
                        height={24}
                    />
                }
                className="py-1 pl-7 pr-2 text-sm transition-all focus-within:pl-2 focus-within:pr-9"
                value={query}
                placeholder="Search..."
                onChange={(event) => setQuery(event.target.value)}
            />
            <div className="h-fit w-full overflow-auto">
                {foundCurrentChatMembers.map((item) => (
                    <ProfileItem
                        type="social"
                        key={item.uuid}
                        accountUUID={item.uuid}
                        selected={item.uuid === selectedUUID}
                        onClick={() =>
                            setSelectedUUID(
                                item.uuid !== selectedUUID
                                    ? item.uuid
                                    : undefined,
                            )
                        }
                    />
                ))}
            </div>
        </>
    );

    const listContent = (currentList: RightSideBarContents) => {
        const uuid =
            currentChatMembers.find((x) => x.uuid === selectedUUID)?.uuid ?? "";

        switch (currentList) {
            case "accessBanMemberList":
                return <ChatAccessBanList />;
            case "commitBanMemberList":
                return <ChatCommitBanList />;
            case "newAccessBan":
                return <AccessBan accountUUID={uuid} />;
            // case "newCommitBan":
            //     return <CommitBan accountUUID={uuid} />;
            default:
                return memberList;
        }
    };

    return (
        <div className="absolute right-0 z-10 h-full w-[310px] min-w-[310px] select-none overflow-clip text-gray-200/80 transition-all duration-100 peer-checked/right:w-0 peer-checked/right:min-w-0 2xl:relative 2xl:flex 2xl:rounded-[28px_0px_0px_28px]">
            <div className="flex h-full w-full shrink-0 flex-col items-start gap-2 bg-black/30 px-4 py-2 backdrop-blur-[20px] 2xl:py-4">
                <div className="flex h-fit shrink-0 flex-row items-start justify-between gap-2 self-stretch 2xl:py-2">
                    <label htmlFor="rightSideBarIcon">
                        <Icon.Members
                            className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                            width={48}
                            height={48}
                        />
                    </label>
                    <div
                        data-checked={memberListDropDown}
                        className="group w-full overflow-hidden"
                    >
                        <label
                            onClick={handleList}
                            htmlFor="memberListDropDown"
                            data-current-list={currentPage}
                            className={`group flex h-12 w-full items-center justify-center gap-2 rounded-md p-4 data-[current-list]:bg-primary/80 data-[current-list]:text-white ${
                                admin &&
                                "hover:bg-primary/30 hover:text-white active:bg-secondary/80"
                            }`}
                        >
                            <p className="w-fit font-sans text-base leading-4 ">
                                {pageTitle(currentPage)}
                            </p>
                        </label>
                        {admin && (
                            <div className="hidden flex-col items-center text-base font-bold text-gray-100/80 group-data-[checked=true]:flex">
                                {admin && (
                                    <MenuItem
                                        onClick={() => {
                                            setCurrentPage(
                                                "commitBanMemberList",
                                            );
                                            setMemberListDropDown(false);
                                        }}
                                        className="active:bg-secondary/80"
                                    >
                                        채팅금지 유저 관리
                                    </MenuItem>
                                )}
                                {admin && (
                                    <MenuItem
                                        onClick={() => {
                                            setCurrentPage(
                                                "accessBanMemberList",
                                            );
                                            setMemberListDropDown(false);
                                        }}
                                        className="active:bg-secondary/80"
                                    >
                                        차단 유저 관리
                                    </MenuItem>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        className={`${
                            currentPage !== undefined && "invisible"
                        }`}
                    >
                        <input
                            onChange={() => setInviteToggle(!inviteToggle)}
                            checked={inviteToggle}
                            id="invite"
                            type="checkbox"
                            className="hidden"
                        />
                        <label
                            htmlFor="invite"
                            data-checked={inviteToggle}
                            title="invite"
                            className="group"
                        >
                            <Icon.Invite
                                className="shrink-0 rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80 group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50"
                                width={48}
                                height={48}
                            />
                        </label>
                    </div>
                </div>

                {listContent(currentPage)}
            </div>
        </div>
    );
}

function InviteForm() {
    const currentChatRoomUUID = useAtomValue(CurrentChatRoomUUIDAtom, {
        store: GlobalStore,
    });
    const selectedAccountUUIDs = useAtomValue(SelectedAccountUUIDsAtom);
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.INVITE_USER_RESULT,
        (_, buf) => {
            const errno = buf.read1();
            if (errno !== 0) {
                alert("초대 실패...");
            }
        },
    );

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const inviteAccountUUIDs = [...new Set([...selectedAccountUUIDs])];

        for (const accountUUID of inviteAccountUUIDs) {
            const buf = ByteBuffer.createWithOpcode(
                ChatServerOpcode.INVITE_USER,
            );
            buf.writeUUID(currentChatRoomUUID);
            buf.writeUUID(accountUUID);
            sendPayload(buf);
        }
    };

    // TODO: complete form!! & add invite button
    return (
        <form className="h-full w-full overflow-auto" onSubmit={handleSubmit}>
            <div className="flex h-full w-full flex-col justify-between gap-4">
                <InviteList className="overflow-auto" />
                <ButtonOnRight
                    buttonText="초대하기"
                    className="relative flex rounded-lg bg-gray-700/80 p-3 text-lg group-valid:bg-green-700/80"
                />
            </div>
        </form>
    );
}
