"use client";

import { useState } from "react";
import {
    IconSidebar,
    IconHamburger,
    IconEdit,
    IconSearch,
} from "@/components/ImageLibrary";
import ChatRoomBlock from "./ChatRoomBlock";
import { FzfHighlight, useFzf } from "react-fzf";
import { TextField } from "@/components/TextField";
import { CreateNewRoom } from "./CreateNewRoom";
import { UUIDSetContainer } from "@/hooks/UUIDSetContext";

type User = {
    id: number;
    uuid: string;
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

const users: User[] = [
    { name: "chanhpar", id: 1, uuid: "1234" },
    { name: "jisookim", id: 2, uuid: "1234" },
    { name: "jkong", id: 3, uuid: "1234" },
    { name: "iyun", id: 4, uuid: "1234" },
    { name: "hdoo", id: 5, uuid: "1234" },
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
        members: [users[1], users[1]],
        title: "glglgkgk",
        latestMessage: "옹옹엉양ㄹ오라ㅣㅁㄴ오맂다넝로미어ㅏ로미단로이머니",
        numberOfUnreadMessages: 10,
    },
    {
        id: 3,
        members: [users[2], users[1]],
        title: "러브포엠",
        latestMessage: "I'm IU ,,>ㅅ<,,",
        numberOfUnreadMessages: 120,
    },
    {
        id: 4,
        members: [users[3], users[1]],
        title: "Not donkikong",
        latestMessage: "I'm Jkong!",
        numberOfUnreadMessages: 3,
    },
    {
        id: 5,
        members: [users[4], users[1]],
        title: "not Minsu",
        latestMessage: "Hi I'm jisoo",
        numberOfUnreadMessages: 1029,
    },
];

export default function ChatLeftSideBar() {
    const [query, setQuery] = useState("");
    const [checked, setChecked] = useState(false);
    const { results, getFzfHighlightProps } = useFzf({
        items: chatRoomsDummy,
        itemToString(item) {
            return getRoomDisplayTitle(item);
        },
        query,
    });

    return (
        <div className="absolute left-0 z-10 h-full w-[310px] min-w-[310px] select-none overflow-clip text-gray-200/80 transition-all duration-100 peer-checked/left:w-0 peer-checked/left:min-w-0 2xl:relative 2xl:flex 2xl:rounded-[0px_28px_28px_0px]">
            <div className="flex h-full w-[310px] shrink flex-col items-start gap-2 bg-black/30 px-4 py-2 backdrop-blur-[50px] 2xl:py-4">
                <div className="flex h-fit shrink-0 flex-row items-center justify-between self-stretch peer-checked:text-gray-200/80 2xl:py-2">
                    <label
                        data-checked={checked}
                        htmlFor="CreateNewRoom"
                        className="relative flex h-12 items-center gap-2 rounded-md p-4 hover:bg-primary/30 hover:text-white data-[checked=true]:bg-secondary/80"
                    >
                        <IconEdit className="" width={17} height={17} />
                        <p className="font-sans text-base leading-4 ">
                            방 만들기
                        </p>
                    </label>

                    <label htmlFor="leftSideBarIcon">
                        <IconSidebar
                            className="hidden rounded-md p-3 text-gray-200/80 hover:bg-primary/30 hover:text-white active:bg-secondary/80 2xl:block"
                            width={48}
                            height={48}
                        />
                        <IconHamburger
                            className="block rounded-md p-3 text-gray-200/80 hover:bg-primary/30 hover:text-white active:bg-secondary/80 2xl:hidden"
                            width={48}
                            height={48}
                        />
                    </label>
                </div>

                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    id="CreateNewRoom"
                    className="peer hidden"
                />

                <div className="flex w-full flex-col gap-2 overflow-auto peer-checked:hidden">
                    <TextField
                        type="search"
                        icon={
                            <IconSearch
                                className="absolute left-1 right-1 top-1 select-none rounded-md p-1 transition-all group-focus-within:left-[15.5rem] group-focus-within:bg-secondary group-focus-within:text-white"
                                width={24}
                                height={24}
                            />
                        }
                        className="py-1 pl-7 pr-2 text-sm transition-all focus-within:pl-2 focus-within:pr-9 peer-checked:hidden"
                        value={query}
                        placeholder="Search..."
                        onChange={(event) => setQuery(event.target.value)}
                    />

                    <div className="h-fit w-full overflow-auto">
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

                <UUIDSetContainer>
                    <CreateNewRoom />
                </UUIDSetContainer>
            </div>
        </div>
    );
}