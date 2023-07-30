import React from "react";
import { Icon } from "../Icon/Icon";
import ChatRoomBlock from "./ChatRoomBlock";

const chatRoomsDummy: {
    id: number;
    members: string[];
    tag: string;
    latestMessage: string;
    nonReadYetMsgNum: number;
    title?: string;
    isLocked: boolean;
}[] = [
    {
        id: 1,
        members: ["hdoo", "hdoo", "chanhpar", "iyun", "jkong"],
        tag: "#000011",
        latestMessage: "맛있는 돈까스가 먹고싶어요 난 등심이 좋더라..",
        nonReadYetMsgNum: 0,
        isLocked: true,
    },
    {
        id: 2,
        members: ["chanhpar"],
        tag: "#000012",
        latestMessage: "옹옹엉양ㄹ오라ㅣㅁㄴ오맂다넝로미어ㅏ로미단로이머니",
        nonReadYetMsgNum: 10,
        isLocked: true,
        title: "Title!",
    },
    {
        id: 3,
        members: ["iyun"],
        tag: "#000013",
        latestMessage: "I'm IU ,,>ㅅ<,,",
        nonReadYetMsgNum: 120,
        isLocked: false,
    },
    {
        id: 4,
        members: ["jkong"],
        tag: "#000014",
        latestMessage: "I'm Jkong!",
        nonReadYetMsgNum: 3,
        isLocked: true,
    },
    {
        id: 5,
        members: ["jisookim"],
        tag: "#000015",
        latestMessage: "Hi I'm jisoo",
        nonReadYetMsgNum: 1029,
        isLocked: false,
    },
];

function ChatSideBarHeader() {
    return (
        <div className="flex h-16 shrink-0 items-center justify-between self-stretch px-2 py-4">
            <div className="flex w-fit items-center gap-2 self-stretch rounded-md">
                <Icon type="edit" size={40} className="" />
                <p className="font-sm font-sans leading-4 text-gray-50 ">
                    Chat
                </p>
            </div>
            <Icon type="sidebar" size={20} className="" />
        </div>
    );
}

//TODO name ChatRoomSearch, SearchChatRoom, + new ChatRoom Button..?
function ChatRoomSearch() {
    return (
        <div className="rounded-xl; flex h-8 shrink-0 items-center gap-2 self-stretch px-2 py-0">
            <div className="flex h-8 w-[305px] shrink-0 items-center gap-2 self-stretch rounded-xl px-2 py-0 shadow-[1px_1.5px_4px_0px_rgba(0,0,0,0.10)_inset,1px_1.5px_4px_0px_rgba(0,0,0,0.08)_inset,0px_-0.5px_1px_0px_rgba(255,255,255,0.25)_inset,0px_-0.5px_1px_0px_rgba(255,255,255,0.30)_inset]">
                {/* <Icon className="float-left" type="search" size={30} /> */}
                <div className="flex-[1_0_0] text-sm font-normal not-italic leading-[22px] text-[color:var(--text-secondary,rgba(255,255,255,0.23))]">
                    <input
                        type="text"
                        className="w-[260px] overflow-hidden text-ellipsis border-[none] bg-transparent outline-none"
                    ></input>
                </div>
                <button>
                    <Icon className="float-left" type="search" size={30} />
                </button>
            </div>
        </div>
    );
}

export default function ChatSideBar() {
    const chatRoomList = chatRoomsDummy; // TODO: get chatRoomList from server
    const chatRoomBlocklist = chatRoomList.map((chatRoomInfo) => (
        <ChatRoomBlock key={chatRoomInfo.id} chatRoomInfo={chatRoomInfo} />
    ));

    return (
        <div>
            <div className="float-left flex h-full shrink-0 flex-col items-start gap-2 rounded-[0px_28px_28px_0px] p-4 backdrop-blur-[50px]">
                <ChatSideBarHeader />
                <ChatRoomSearch />
                <>
                    {" "}
                    {/* div같은걸로 감싸는게 안낫나요? */}
                    {chatRoomBlocklist}
                </>
            </div>
        </div>
    );
}
