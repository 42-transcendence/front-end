import React, { /* useContext, */ useState } from "react";
import SidebarIcon from "/public/sidebar.svg";
import EditIcon from "/public/edit.svg";
import ChatRoomBlock from "./ChatRoomBlock";
// import { SearchBox } from "../TextField";
import SearchIcon from "/public/search.svg";
import { FzfHighlight, useFzf } from "react-fzf";
import { TextField } from "../TextField/SearchBox";

type User = {
    id: number;
    name: string;
};

// TODO: displaytitle을 front-end에서 직접 정하는게 아니라, 백엔드에서 없으면
// 동일 로직으로 타이틀을 만들어서 프론트에 넘겨주고, 프론트에선 타이틀을 항상
// 존재하는 프로퍼티로 추후 변경할 수도

function getRoomDisplayTitle(chatRoom: ChatRoomInfo) {
    return (
        chatRoom.title ??
        chatRoom.members
            .reduce((acc, member) => [...acc, member.name], [] as string[])
            .join(", ")
    );
}

const users = [
    { name: "chanhpar", id: 1 },
    { name: "jisookim", id: 1 },
    { name: "", id: 1 },
    { name: "hdoo", id: 1 },
];

export type ChatRoomInfo = {
    id: number;
    members: User[];
    title?: string | undefined;
    latestMessage?: string;
    numberOfUnreadMessages: number;
};

export const chatRoomsDummy: ChatRoomInfo[] = [
    {
        id: 1,
        members: users,
        latestMessage: "맛있는 돈까스가 먹고싶어요 난 등심이 좋더라..",
        numberOfUnreadMessages: 0,
    },
    {
        id: 2,
        members: [users[0], users[1]],
        title: "glglgkgk",
        latestMessage: "옹옹엉양ㄹ오라ㅣㅁㄴ오맂다넝로미어ㅏ로미단로이머니",
        numberOfUnreadMessages: 10,
    },
    {
        id: 3,
        members: [users[0], users[1]],
        title: "러브포엠",
        latestMessage: "I'm IU ,,>ㅅ<,,",
        numberOfUnreadMessages: 120,
    },
    {
        id: 4,
        members: [users[0], users[1]],
        title: "Not donkikong",
        latestMessage: "I'm Jkong!",
        numberOfUnreadMessages: 3,
    },
    {
        id: 5,
        members: [users[0], users[1]],
        title: "not Minsu",
        latestMessage: "Hi I'm jisoo",
        numberOfUnreadMessages: 1029,
    },
];

export default function ChatSideBar() {
    const [query, setQuery] = useState("");
    const { results, getFzfHighlightProps } = useFzf({
        items: chatRoomsDummy,
        itemToString(item) {
            return getRoomDisplayTitle(item);
        },
        limit: 5,
        query,
    });

    return (
        <div>
            <div className="gradient-border float-left flex h-full w-[310px] shrink-0 flex-col items-start gap-2 rounded-[0px_28px_28px_0px] bg-black/30 p-4 backdrop-blur-[50px] before:rounded-[28px] before:p-px before:content-['']">
                <div className="flex h-16 shrink-0 items-center justify-between self-stretch px-2 py-4">
                    <div className="flex items-center gap-2 self-stretch rounded-md">
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
                <TextField
                    value={query}
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                >
                    <button>
                        <SearchIcon
                            className="text-gray-50"
                            width={20}
                            height="100%"
                        />
                    </button>
                </TextField>

                <div>
                    {results.map((item, index) => (
                        <ChatRoomBlock key={item.id} chatRoom={item}>
                            <FzfHighlight
                                {...getFzfHighlightProps({
                                    index,
                                    item,
                                    className: "text-yellow-500",
                                })}
                            />
                        </ChatRoomBlock>
                    ))}
                </div>
            </div>
        </div>
    );
}
