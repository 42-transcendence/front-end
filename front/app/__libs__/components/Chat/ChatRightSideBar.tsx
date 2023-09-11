"use client";

import { useCallback, useState } from "react";
import { Icon } from "@components/ImageLibrary";
import { TextField } from "@components/TextField";
import { ProfileItem } from "@components/ProfileItem";
import { InviteList } from "@components/Service/InviteList";
import { ButtonOnRight } from "../Button/ButtonOnRight";
import { ChatAccessBanList, ChatCommitBanList } from "./ChatBanList";
import { MenuItem } from "./MenuItem";
import { AccessBan, ReportUser, SendBan } from "./NewBan";
import { Provider, useAtom, useAtomValue } from "jotai";
import { SelectedAccountUUIDsAtom } from "@atoms/AccountAtom";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode, ChatServerOpcode } from "@common/chat-opcodes";
import { ByteBuffer } from "@akasha-lib";
import {
    useCurrentAccountUUID,
    useCurrentChatRoomUUID,
} from "@hooks/useCurrent";
import { useChatMember, useChatRoomMembers } from "@hooks/useChatRoom";
import { useFzf } from "react-fzf";
import { handleInviteRoomResult } from "@akasha-utils/chat-gateway-client";
import { ChatErrorNumber } from "@common/chat-payloads";
import { ChatRightSideBarCurrrentPage } from "@atoms/ChatAtom";
import { RoleNumber } from "@common/generated/types";

export type RightSideBarContents =
    | "report"
    | "newSendBan"
    | "newAccessBan"
    | "sendBanMemberList"
    | "accessBanMemberList"
    | undefined;

// TODO: refactoring 하고 어떻게 잘 함수 분리해보기

export default function ChatRightSideBar() {
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const currentChatMembers = useChatRoomMembers(currentChatRoomUUID);
    const [selectedUUID, setSelectedUUID] = useState<string>();
    const [query, setQuery] = useState("");
    const { results: foundCurrentChatMembers } = useFzf({
        items: [...(currentChatMembers?.values() ?? [])],
        itemToString(item) {
            //TODO: fetch...? Fzf 지우기가 먼저인가? (2) 같은 문제가 InviteList에도 있으니 반드시 참조 바람
            return item.accountId;
        },
        limit: 5,
        query,
    });
    const [inviteToggle, setInviteToggle] = useState(false);
    const currentId = useCurrentAccountUUID();
    const currentUser = useChatMember(currentChatRoomUUID, currentId);
    const roleLevel = Number(currentUser?.role ?? 0);
    const adminRoleLevel: number = RoleNumber.MANAGER;

    const [currentPage, setCurrentPage] = useAtom(ChatRightSideBarCurrrentPage);
    const [memberListDropDown, setMemberListDropDown] = useState(false);

    const handleList = () => {
        setMemberListDropDown(!memberListDropDown);
        if (currentPage !== undefined) {
            setInviteToggle(false);
            setCurrentPage(undefined);
            setMemberListDropDown(false);
        }
    };

    const pageTitle = (currentPage: RightSideBarContents) => {
        switch (currentPage) {
            case "accessBanMemberList":
                return "차단 유저 목록";
            case "sendBanMemberList":
                return "채팅금지 유저 목록";
            case "newSendBan":
                return "채팅 금지";
            case "newAccessBan":
                return "내보내기";
            case "report":
                return "신고하기";
            default:
                return "멤버 목록";
        }
    };

    const ListContent = useCallback(
        ({ currentPage }: { currentPage: RightSideBarContents }) => {
            switch (currentPage) {
                case "accessBanMemberList":
                    return <ChatAccessBanList />;
                case "sendBanMemberList":
                    return <ChatCommitBanList />;
                case "newAccessBan":
                    return <AccessBan accountUUID={selectedUUID ?? ""} />;
                case "newSendBan":
                    return <SendBan accountUUID={selectedUUID ?? ""} />;
                case "report":
                    return <ReportUser accountUUID={selectedUUID ?? ""} />;
                default:
                    return <></>;
            }
        },
        [selectedUUID],
    );

    return (
        <div className="absolute right-0 top-0 z-10 h-full w-[310px] min-w-[310px] select-none overflow-hidden rounded-[0px_28px_28px_0px] bg-black/30 text-gray-200/80 backdrop-blur-[50px] transition-all duration-100 peer-checked/right:w-0 peer-checked/right:min-w-0 2xl:relative 2xl:flex 2xl:rounded-[28px] 2xl:bg-black/30">
            <div className="flex h-full w-full shrink-0 flex-col items-start gap-2 px-4 py-2 2xl:py-4">
                <div className="flex h-fit shrink-0 flex-row items-start justify-between gap-2 self-stretch py-2 ">
                    <label htmlFor="rightSideBarIcon">
                        <Icon.MembersFilled
                            className="rounded-md p-3 text-gray-50/80 hover:bg-primary/30 active:bg-secondary/80"
                            width={48}
                            height={48}
                        />
                    </label>
                    <div
                        data-checked={memberListDropDown}
                        className="group w-full"
                    >
                        <label
                            onClick={handleList}
                            htmlFor="memberListDropDown"
                            data-current-list={currentPage}
                            className={`group flex h-12 w-full items-center justify-center gap-2 rounded-md p-4 data-[current-list]:scale-105 data-[current-list]:bg-primary/80 data-[current-list]:text-white data-[current-list]:transition-all ${
                                roleLevel >= adminRoleLevel &&
                                "hover:bg-primary/30 hover:text-white active:bg-secondary/80"
                            }`}
                        >
                            <p className="w-fit font-sans text-base leading-4 ">
                                {pageTitle(currentPage)}
                            </p>
                        </label>
                        {roleLevel >= adminRoleLevel && (
                            <div className="hidden flex-col items-center text-base font-bold text-gray-100/80 group-data-[checked=true]:flex">
                                <MenuItem
                                    onClick={() => {
                                        setCurrentPage("sendBanMemberList");
                                        setMemberListDropDown(false);
                                    }}
                                    className="active:bg-secondary/80"
                                >
                                    채팅금지 유저 관리
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setCurrentPage("accessBanMemberList");
                                        setMemberListDropDown(false);
                                    }}
                                    className="active:bg-secondary/80"
                                >
                                    차단 유저 관리
                                </MenuItem>
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

                {currentPage !== undefined && (
                    <div className="fixed inset-4 top-32 z-50 rounded-[12px] bg-gray-800 p-4">
                        <ListContent currentPage={currentPage} />
                    </div>
                )}
                {inviteToggle ? (
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
                                    type="ChatRoom"
                                    key={item.accountId}
                                    accountUUID={item.accountId}
                                    selected={item.accountId === selectedUUID}
                                    onClick={() =>
                                        setSelectedUUID(
                                            item.accountId !== selectedUUID
                                                ? item.accountId
                                                : undefined,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function InviteForm() {
    const currentChatRoomUUID = useCurrentChatRoomUUID();
    const selectedAccountUUIDs = useAtomValue(SelectedAccountUUIDsAtom);
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.INVITE_USER_RESULT,
        (_, payload) => {
            const [errno, chatId, targetAccountId] =
                handleInviteRoomResult(payload);
            if (errno !== ChatErrorNumber.SUCCESS) {
                //FIXME: 더 정상적으로 처리
                alert(
                    "초대 실패... " +
                        errno +
                        ", " +
                        chatId +
                        ", " +
                        targetAccountId,
                );
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
                    className="relative flex rounded-lg bg-gray-700/80 p-3 text-lg hover:bg-green-500/50 hover:text-white active:bg-green-300/50 active:text-white group-valid:bg-green-700/80"
                />
            </div>
        </form>
    );
}
