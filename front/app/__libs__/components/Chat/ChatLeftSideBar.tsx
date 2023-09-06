"use client";

import { useEffect, useState } from "react";
import { Icon } from "@components/ImageLibrary";
import {
    ChatDirectRoomBlock,
    ChatPublicRoomBlock,
    ChatRoomBlock,
} from "./ChatRoomBlock";
import { TextField } from "@components/TextField";
import { CreateNewRoom } from "./CreateNewRoom";
import { Provider, useAtom, useAtomValue } from "jotai";
import {
    ChatRoomListAtom,
    CreateNewRoomCheckedAtom,
    DirectRoomListAtom,
} from "@atoms/ChatAtom";

import { FzfHighlight, useFzf } from "react-fzf";
import { Tab } from "@headlessui/react";

import type {
    ChatDirectEntry,
    ChatRoomEntry,
    ChatRoomViewEntry,
} from "@common/chat-payloads";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { handlePublicRoomList } from "@akasha-utils/chat-gateway-client";
import { makePublicRoomListRequest } from "@akasha-utils/chat-payload-builder-client";
import { AnimatePresence, motion } from "framer-motion";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function ChatLeftSideBar() {
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.PUBLIC_ROOM_LIST,
        (_, buffer) => {
            const list = handlePublicRoomList(buffer);
            setChatPublicRoomList(list);
        },
    );
    useEffect(() => {
        sendPayload(makePublicRoomListRequest());
    }, [sendPayload]);
    const chatJoinRoomList = useAtomValue(ChatRoomListAtom);
    const chatDirectRoomList = useAtomValue(DirectRoomListAtom);
    const [chatPublicRoomList, setChatPublicRoomList] = useState(
        Array<ChatRoomViewEntry>(),
    );
    const [query, setQuery] = useState("");
    const categories = [
        {
            name: "그룹",
            Component: <RoomPanel rooms={chatJoinRoomList} query={query} />,
        },
        {
            name: "1:1",
            Component: (
                <DirectRoomPanel rooms={chatDirectRoomList} query={query} />
            ),
        },
        {
            name: "찾기",
            Component: (
                <PublicRoomPanel rooms={chatPublicRoomList} query={query} />
            ),
        },
    ];
    const [tab, setTab] = useState(1);
    const [createNewRoomChecked, setCreateNewRoomChecked] = useAtom(
        CreateNewRoomCheckedAtom,
    );

    return (
        <ChatLeftSideBarLayout>
            <div className="flex h-fit shrink-0 flex-row items-center justify-between self-stretch py-2 peer-checked:text-gray-200/80">
                <label
                    data-checked={createNewRoomChecked}
                    tabIndex={0}
                    htmlFor="CreateNewRoom"
                    className="relative flex h-12 items-center gap-2 rounded-md p-4 outline-none hover:bg-primary/30 hover:transition-all focus-visible:outline-primary/70 data-[checked=true]:scale-105 data-[checked=true]:bg-secondary/80"
                >
                    <Icon.Edit className="" width={17} height={17} />
                    <p className="font-sans text-base leading-4">방 만들기</p>
                </label>

                <label tabIndex={0} htmlFor="forCloseLeftSideBar">
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
                checked={createNewRoomChecked}
                onChange={(e) => setCreateNewRoomChecked(e.target.checked)}
                id="CreateNewRoom"
                className="peer hidden"
            />

            <AnimatePresence>
                <Tab.Group>
                    <Tab.List
                        as={motion.div}
                        onClick={() => {
                            setQuery("");
                        }}
                        className={({ selectedIndex }) => {
                            setTab(selectedIndex);
                            return "flex h-10 w-full space-x-1 rounded-lg bg-black/30 p-1";
                        }}
                    >
                        <motion.div
                            animate={
                                tab === 0
                                    ? { x: [null, 139, 0] }
                                    : { x: [null, 0, 139] }
                            }
                            transition={{ type: "spring", duration: 0.3 }}
                            className={classNames(
                                "absolute flex h-8 w-full pb-1",
                            )}
                        >
                            {categories.map((category, idx) => (
                                <Tab
                                    key={idx}
                                    className={({ selected }) =>
                                        classNames(
                                            "w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-50/70",
                                            "outline-none focus-within:outline-primary/30",
                                            selected
                                                ? "bg-secondary/30 shadow"
                                                : "hover:bg-primary/30 hover:text-white",
                                        )
                                    }
                                >
                                    {category.name}
                                </Tab>
                            ))}
                            <div className="h-full w-[139px] rounded-lg bg-secondary/80" />
                        </motion.div>
                    </Tab.List>
                    <ListQuaryTextField
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <Tab.Panels className="h-full w-full overflow-auto">
                        {categories.map((category, idx) => (
                            <Tab.Panel key={idx}>
                                {category.Component}
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </AnimatePresence>

            <Provider>
                <CreateNewRoom />
            </Provider>
        </ChatLeftSideBarLayout>
    );
}

function ChatLeftSideBarLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="absolute z-10 h-full w-[310px] min-w-[310px] select-none overflow-clip bg-black/30 text-gray-200/80 backdrop-blur-[50px] transition-all duration-100 peer-checked/left:w-0 peer-checked/left:min-w-0 peer-checked/left:p-0 2xl:relative 2xl:flex 2xl:rounded-[0px_28px_28px_0px]">
            <div className="flex h-full w-[310px] shrink-0 flex-col items-start gap-2 px-4 py-2 2xl:py-4">
                {children}
            </div>
        </div>
    );
}

function RoomPanel({
    rooms,
    query,
}: {
    rooms: ChatRoomEntry[];
    query: string;
}) {
    const { results, getFzfHighlightProps } = useFzf({
        items: rooms,
        itemToString: (item) => item.title,
        query,
    });

    return results.map((item, index) => (
        <ChatRoomBlock key={item.id} chatRoom={item}>
            <FzfHighlight
                {...getFzfHighlightProps({
                    index,
                    item,
                    className: "text-yellow-500",
                })}
            />
        </ChatRoomBlock>
    ));
}

function DirectRoomPanel({
    rooms,
    query,
}: {
    rooms: ChatDirectEntry[];
    query: string;
}) {
    const { results, getFzfHighlightProps } = useFzf({
        items: rooms,
        itemToString: (item) => item.targetAccountId, //FIXME: 여기서 이름을 알 수가 없는데?
        query,
    });

    return results.map((item, index) => (
        <ChatDirectRoomBlock key={item.targetAccountId} chatRoom={item}>
            <FzfHighlight
                {...getFzfHighlightProps({
                    index,
                    item,
                    className: "text-yellow-500",
                })}
            />
        </ChatDirectRoomBlock>
    ));
}

function PublicRoomPanel({
    rooms,
    query,
}: {
    rooms: ChatRoomViewEntry[];
    query: string;
}) {
    const { results, getFzfHighlightProps } = useFzf({
        items: rooms,
        itemToString: (item) => item.title,
        query,
    });

    return results.map((item, index) => (
        <ChatPublicRoomBlock key={item.id} chatRoom={item}>
            <FzfHighlight
                {...getFzfHighlightProps({
                    index,
                    item,
                    className: "text-yellow-500",
                })}
            />
        </ChatPublicRoomBlock>
    ));
}

function ListQuaryTextField({
    value,
    onChange,
}: {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <div className="mb-2 flex w-full flex-col gap-2 peer-checked:hidden">
            <TextField
                type="search"
                icon={
                    <Icon.Search
                        className="absolute left-1 right-1 top-1 select-none rounded-md p-1 transition-all group-focus-within:bg-secondary group-focus-within:text-white"
                        width={24}
                        height={24}
                    />
                }
                className="py-1 pl-7 pr-2 text-sm transition-all focus-within:pl-9 peer-checked:hidden"
                placeholder="Search..."
                autoFocus={false}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
