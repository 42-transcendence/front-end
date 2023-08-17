"use client";

import {
    FormEventHandler,
    SetStateAction,
    useEffect,
    useReducer,
    useRef,
} from "react";
import {
    IconKey,
    IconLock,
    IconMembers,
    IconPerson,
} from "@/components/ImageLibrary";
import { ToggleButton } from "@/components/Button/ToggleButton";
import { ProfileItemSelectable } from "../ProfileItem/ProfileItemSelectable";
import React, { useState } from "react";
import {
    IconSidebar,
    IconHamburger,
    IconEdit,
    IconSearch,
} from "@/components/ImageLibrary";
import ChatRoomBlock from "./ChatRoomBlock";
import { FzfHighlight, useFzf } from "react-fzf";
import { TextField } from "../TextField";

type User = {
    id: number;
    name: string;
};

const titlePattern = ".{4,32}";

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
    { name: "jisookim", id: 2 },
    { name: "jkong", id: 3 },
    { name: "iyun", id: 4 },
    { name: "hdoo", id: 5 },
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

export default function ChatRoomList() {
    const [query, setQuery] = useState("");
    const [checked, setChecked] = useState(false);
    const { results, getFzfHighlightProps } = useFzf({
        items: chatRoomsDummy,
        itemToString(item) {
            return getRoomDisplayTitle(item);
        },
        query,
    });
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");
    const [limit, setLimit] = useState(1);
    const [privateChecked, setPrivateChecked] = useState(false);
    const [passwordChecked, setPasswordChecked] = useState(false);
    const [limitChecked, setLimitChecked] = useState(false);
    const [inviteChecked, setInviteChecked] = useState(false);
    const [selectedAccounts, dispatchSelectedAccounts] = useReducer(
        reducer,
        undefined,
        () => new Set<string>(),
    );

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        //TODO: make new room with title, password, limit;
    };

    function handleChecked() {
        setChecked(!checked);
    }

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
                    onChange={handleChecked}
                    id="CreateNewRoom"
                    className="peer hidden"
                />

                {/* IconsearchBar */}
                <div className="peer-checked:hidden">
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

                    <div className="peer-checked:hidden">
                        <div className="flex w-full shrink-0 scroll-m-2 flex-col gap-2 overflow-auto">
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

                <form
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    className="group hidden h-full w-full overflow-auto peer-checked:flex"
                >
                    <div className="flex h-full w-full flex-col justify-between gap-4">
                        <div className="flex flex-col gap-2 self-stretch overflow-auto">
                            <div className="relative flex h-fit w-full flex-col gap-2 py-2">
                                <TextField
                                    type="text"
                                    className="relative bg-black/30 px-4 py-1 text-xl"
                                    placeholder="Title..."
                                    pattern={titlePattern}
                                    required
                                    value={title}
                                    onChange={(event) => {
                                        setTitle(event.target.value);
                                    }}
                                />

                                <div className="flex flex-col">
                                    <ToggleButton
                                        id="private"
                                        checked={privateChecked}
                                        setChecked={setPrivateChecked}
                                        bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                        icon={
                                            <IconLock
                                                width={56}
                                                height={56}
                                                className="rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                            />
                                        }
                                    >
                                        <div>
                                            <p className="relative text-sm group-data-[checked=true]:hidden">
                                                공개
                                            </p>
                                            <p className="relative hidden text-sm group-data-[checked=true]:block">
                                                비공개
                                            </p>
                                        </div>
                                    </ToggleButton>

                                    <ToggleButton
                                        id="secret"
                                        checked={passwordChecked}
                                        setChecked={setPasswordChecked}
                                        bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                        icon={
                                            <IconKey
                                                width={56}
                                                height={56}
                                                className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                            />
                                        }
                                    >
                                        <div className="flex flex-col gap-1">
                                            <div className="justify-center text-sm transition-all">
                                                비밀번호
                                            </div>
                                            <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-data-[checked=true]:flex">
                                                <TextField
                                                    type="new-password"
                                                    placeholder="비밀번호 입력"
                                                    className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                                                    value={password}
                                                    onChange={(event) => {
                                                        setPassword(
                                                            event.target.value,
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </ToggleButton>

                                    <ToggleButton
                                        id="limit"
                                        checked={limitChecked}
                                        setChecked={setLimitChecked}
                                        bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                        icon={
                                            <IconMembers
                                                width={56}
                                                height={56}
                                                className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                            />
                                        }
                                    >
                                        <div className="flex flex-col gap-1">
                                            <h2 className="items-end justify-center text-sm transition-all">
                                                인원제한
                                            </h2>
                                            <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-data-[checked=true]:flex">
                                                <TextField
                                                    type="number"
                                                    disabled={!limitChecked}
                                                    min={1}
                                                    max={1500}
                                                    placeholder="최대인원 입력"
                                                    className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                                                    value={limit}
                                                    onChange={(event) => {
                                                        setLimit(
                                                            Number(
                                                                event.target
                                                                    .value,
                                                            ),
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </ToggleButton>

                                    <InviteFriendToggle
                                        checked={inviteChecked}
                                        setChecked={setInviteChecked}
                                        selectedAccounts={selectedAccounts}
                                        dispatchSelectedAccounts={
                                            dispatchSelectedAccounts
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <ButtonOnRight
                            buttonText="만들기"
                            className="relative flex rounded-lg bg-gray-700/80 p-3 text-lg group-valid:bg-green-700/80"
                        />
                    </div>
                </form>

                {/*<CreateNewRoom className="hidden peer-checked:block peer-checked:py-0" />*/}
            </div>
        </div>
    );
}

const FriendListMockup = [
    { accountUUID: "4281c108-c015-4e3f-8504", tag: "60a248bd96df" },
    { accountUUID: "0eb0761e-4b92-41ea-ae6d", tag: "a3746330085e" },
    { accountUUID: "be67e302-27a3-460d-9fcf", tag: "59b3d8d9460b" },
    { accountUUID: "e3eb8922-ce6d-4eb0-991e", tag: "1a7dc7d9ce7f" },
    { accountUUID: "b5e0840d-7ba2-4836-a775", tag: "8dac118a8e20" },
    { accountUUID: "2e2202cc-7687-4824-9831", tag: "f2c2fd7450ea" },
    { accountUUID: "614c0bcc-1dd1-4c8d-be7c", tag: "f8f5f0889a32" },
    { accountUUID: "c2104808-a9f5-44d5-afa3", tag: "38a2e73290eb" },
    { accountUUID: "20ba35c9-69bb-4c62-ab53", tag: "fc9c89452b61" },
    { accountUUID: "fe5429ea-d841-4301-98c1", tag: "9ae9fa40ab81" },
];

type AccountSelectAction = {
    command: "add" | "delete" | "toggle";
    value: string;
};

function reducer(state: Set<string>, action: AccountSelectAction): Set<string> {
    const newSet = new Set<string>(state);
    const value = action.value;
    switch (action.command) {
        case "add":
            newSet.add(value);
            break;
        case "delete":
            newSet.delete(value);
            break;
        case "toggle":
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            break;
    }
    return newSet;
}

export function CreateNewRoom({ className }: { className: string }) {
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");
    const [limit, setLimit] = useState(1);
    const [privateChecked, setPrivateChecked] = useState(false);
    const [passwordChecked, setPasswordChecked] = useState(false);
    const [limitChecked, setLimitChecked] = useState(false);
    const [inviteChecked, setInviteChecked] = useState(false);
    const [selectedAccounts, dispatchSelectedAccounts] = useReducer(
        reducer,
        undefined,
        () => new Set<string>(),
    );

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        //TODO: make new room with title, password, limit;
    };

    return (
        <div className={`${className} group relative h-full w-full shrink `}>
            <form
                autoComplete="off"
                className="h-full w-full"
                onSubmit={handleSubmit}
            >
                <div className="relative flex h-full w-full shrink flex-col items-start justify-between gap-2 p-4 px-4 py-2 backdrop-blur-[50px] 2xl:py-4">
                    <div className="flex flex-col gap-1 self-stretch">
                        <div className="relative flex h-fit w-full flex-col py-2">
                            <TextField
                                type="text"
                                className="relative bg-black/30 px-4 py-1 text-xl"
                                placeholder="Title..."
                                pattern=".{0,32}"
                                required
                                value={title}
                                onChange={(event) => {
                                    setTitle(event.target.value);
                                }}
                            />

                            <div className="flex flex-col">
                                <ToggleButton
                                    id="private"
                                    checked={privateChecked}
                                    setChecked={setPrivateChecked}
                                    bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                    icon={
                                        <IconLock
                                            width={56}
                                            height={56}
                                            className="rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                        />
                                    }
                                >
                                    <div>
                                        <p className="relative text-sm group-data-[checked=true]:hidden">
                                            공개
                                        </p>
                                        <p className="relative hidden text-sm group-data-[checked=true]:block">
                                            비공개
                                        </p>
                                    </div>
                                </ToggleButton>

                                <ToggleButton
                                    id="secret"
                                    checked={passwordChecked}
                                    setChecked={setPasswordChecked}
                                    bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                    icon={
                                        <IconKey
                                            width={56}
                                            height={56}
                                            className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                        />
                                    }
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="justify-center text-sm transition-all">
                                            비밀번호
                                        </div>
                                        <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-data-[checked=true]:flex">
                                            <TextField
                                                type="new-password"
                                                placeholder="비밀번호 입력"
                                                className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                                                value={password}
                                                onChange={(event) => {
                                                    setPassword(
                                                        event.target.value,
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </ToggleButton>

                                <ToggleButton
                                    id="limit"
                                    checked={limitChecked}
                                    setChecked={setLimitChecked}
                                    bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
                                    icon={
                                        <IconMembers
                                            width={56}
                                            height={56}
                                            className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                                        />
                                    }
                                >
                                    <div className="flex flex-col gap-1">
                                        <h2 className="items-end justify-center text-sm transition-all">
                                            인원제한
                                        </h2>
                                        <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-data-[checked=true]:flex">
                                            <TextField
                                                type="number"
                                                disabled={!limitChecked}
                                                min={1}
                                                max={1500}
                                                placeholder="최대인원 입력"
                                                className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                                                value={limit}
                                                onChange={(event) => {
                                                    setLimit(
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </ToggleButton>
                            </div>
                        </div>

                        <InviteFriendToggle
                            checked={inviteChecked}
                            setChecked={setInviteChecked}
                            selectedAccounts={selectedAccounts}
                            dispatchSelectedAccounts={dispatchSelectedAccounts}
                        />
                    </div>

                    <div className="relative flex justify-center self-stretch">
                        <ButtonOnRight
                            buttonText="만들기"
                            className="relative flex rounded-lg bg-gray-700/80 p-3 text-lg group-valid:bg-green-700/80"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

function useDetectSticky(): [
    boolean,
    React.LegacyRef<HTMLLabelElement>,
    React.Dispatch<React.SetStateAction<boolean>>,
] {
    const [isSticky, setIsSticky] = useState(false);
    const ref = useRef<HTMLLabelElement>(undefined!);

    // mount
    useEffect(() => {
        if (ref.current === undefined) {
            throw new Error();
        }
        const cachedRef = ref.current;
        const observer = new IntersectionObserver(
            ([e]) => {
                setIsSticky(e.intersectionRatio > 0 && e.intersectionRatio < 1);
            },
            { threshold: [1] },
        );

        observer.observe(cachedRef);

        // unmount
        return () => {
            observer.unobserve(cachedRef);
        };
    }, [ref]);

    return [isSticky, ref, setIsSticky];
}

function InviteFriendToggle({
    checked,
    setChecked,
    selectedAccounts,
    dispatchSelectedAccounts,
}: {
    selectedAccounts: Set<string>;
    dispatchSelectedAccounts: React.Dispatch<AccountSelectAction>;
    checked: boolean;
    setChecked: React.Dispatch<SetStateAction<boolean>>;
}) {
    const [isSticky, ref] = useDetectSticky();

    return (
        <div className="flex flex-col gap-2">
            <label
                ref={ref}
                htmlFor="sectionHeader"
                data-checked={checked}
                data-sticky={isSticky}
                className="group sticky -top-1 z-10 flex h-fit w-full flex-row items-center gap-3 rounded p-3 transition-colors hover:bg-gray-500/30 hover:text-white data-[sticky=true]:bg-secondary data-[sticky=true]:duration-0"
            >
                <IconPerson
                    width={56}
                    height={56}
                    className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-data-[checked=true]:bg-secondary group-data-[checked=true]:text-gray-50/80"
                />
                <input
                    onChange={() => {
                        setChecked(!checked);
                    }}
                    checked={checked}
                    type="checkbox"
                    id="sectionHeader"
                    className="hidden"
                />
                <p className="px-1 text-sm group-data-[checked=true]:text-white">
                    초대 상대 선택
                </p>
            </label>
            {checked && (
                <InviteList
                    selectedAccounts={selectedAccounts}
                    dispatchSelectedAccounts={dispatchSelectedAccounts}
                />
            )}
        </div>
    );
}

function InviteList({
    selectedAccounts,
    dispatchSelectedAccounts,
}: {
    selectedAccounts: Set<string>;
    dispatchSelectedAccounts: React.Dispatch<AccountSelectAction>;
}) {
    const [query, setQuery] = useState("");
    const { results, getFzfHighlightProps } = useFzf({
        items: FriendListMockup,
        itemToString(item) {
            return item.accountUUID + "#" + item.tag;
        },
        query,
    });

    return (
        <div className="flex flex-col gap-2">
            <TextField
                type="text"
                className="px-3"
                placeholder="Search..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <div className="flex h-full flex-col items-center gap-1 self-stretch overflow-auto">
                {results.map((item, index) => {
                    return (
                        <ProfileItemSelectable
                            key={item.accountUUID}
                            accountUUID={item.accountUUID}
                            selected={selectedAccounts.has(item.accountUUID)}
                            onClick={() =>
                                dispatchSelectedAccounts({
                                    command: "toggle",
                                    value: item.accountUUID,
                                })
                            }
                        >
                            <FzfHighlight
                                {...getFzfHighlightProps({
                                    index,
                                    item,
                                    className: "text-yellow-500",
                                })}
                            />
                        </ProfileItemSelectable>
                    );
                })}
            </div>
        </div>
    );
}

function ButtonOnRight({
    buttonText,
    className,
}: {
    buttonText: string;
    className: string;
}) {
    return (
        <div className="relative flex min-h-fit w-full flex-shrink-0 flex-row justify-end">
            <button className={`${className}`}>{buttonText}</button>
        </div>
    );
}
