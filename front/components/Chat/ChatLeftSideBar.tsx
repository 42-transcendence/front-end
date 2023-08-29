"use client";

import { useState } from "react";
import { Icon } from "@/components/ImageLibrary";
import ChatRoomBlock from "./ChatRoomBlock";
import { FzfHighlight, useFzf } from "react-fzf";
import { TextField } from "@/components/TextField";
import { CreateNewRoom } from "./CreateNewRoom";
import { UUIDSetContainer } from "@/hooks/UUIDSetContext";
import { useAtomValue } from "jotai";
import { ChatRoomListAtom } from "@/atom/ChatAtom";

export default function ChatLeftSideBar() {
    const chatRoomList = useAtomValue(ChatRoomListAtom);
    const [query, setQuery] = useState("");
    const [checked, setChecked] = useState(false);
    const { results, getFzfHighlightProps } = useFzf({
        items: chatRoomList,
        itemToString: (item) => item.title,
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
                        <Icon.Edit className="" width={17} height={17} />
                        <p className="font-sans text-base leading-4 ">
                            방 만들기
                        </p>
                    </label>

                    <label htmlFor="leftSideBarIcon">
                        <Icon.Sidebar
                            className="hidden rounded-md p-3 text-gray-200/80 hover:bg-primary/30 hover:text-white active:bg-secondary/80 2xl:block"
                            width={48}
                            height={48}
                        />
                        <Icon.Hamburger
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
                            <Icon.Search
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
                            <ChatRoomBlock key={item.uuid} chatRoom={item}>
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
