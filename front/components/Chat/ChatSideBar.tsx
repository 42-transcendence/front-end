import React from "react";
import SidebarIcon from "/public/sidebar.svg";
import EditIcon from "/public/edit.svg";
import ChatRoomBlock from "./ChatRoomBlock";
import { TextField } from "../TextField";

const chatRoomsDummy = [
    {
        id: 1,
        member: "hdoo",
        tag: "#000011",
        latestMessage: "맛있는 돈까스가 먹고싶어요 난 등심이 좋더라..",
        nonReadYet: true,
    },
    {
        id: 2,
        member: "chanhpar",
        tag: "#000012",
        latestMessage: "옹옹엉양ㄹ오라ㅣㅁㄴ오맂다넝로미어ㅏ로미단로이머니",
        nonReadYetMsgNum: 10,
    },
    {
        id: 3,
        member: "iyun",
        tag: "#000013",
        latestMessage: "I'm IU ,,>ㅅ<,,",
        nonReadYetMsgNum: 120,
    },
    {
        id: 4,
        member: "jkong",
        tag: "#000014",
        latestMessage: "I'm Jkong!",
        nonReadYetMsgNum: 3,
    },
    {
        id: 5,
        member: "jisookim",
        tag: "#000015",
        latestMessage: "Hi I'm jisoo",
        nonReadYetMsgNum: 1029,
    },
];

export default function ChatSideBar() {
    return (
        <div>
            <div className="gradient-border float-left flex h-full shrink-0 flex-col items-start gap-2 rounded-[0px_28px_28px_0px] bg-black/30 p-4 backdrop-blur-[50px] before:rounded-[28px] before:p-px before:content-['']">
                <div className="flex h-16 shrink-0 items-center justify-between self-stretch px-2 py-4">
                    <div className="flex w-fit items-center gap-2 self-stretch rounded-md">
                        <EditIcon
                            className="text-gray-50"
                            width={22}
                            height="100%"
                        />
                        <p className="font-sans text-2xl leading-4 text-gray-50 ">
                            Chat
                        </p>
                    </div>
                    <SidebarIcon
                        className="text-gray-50"
                        width={42}
                        height="100%"
                    />
                </div>

                {/* searchBar */}
                <TextField />
            </div>
        </div>
    );
}
