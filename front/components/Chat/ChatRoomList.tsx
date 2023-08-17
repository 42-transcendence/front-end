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
    { accountUUID: "b1a49f3f-56e4-4fb3-bd8c", tag: "daf6d88a3523" },
    { accountUUID: "12df52f9-db4a-4d59-8dde", tag: "8640fad633b0" },
    { accountUUID: "f8829903-5f4b-49a7-afb9", tag: "6f0eced487ae" },
    { accountUUID: "4139f9b6-18e4-4042-b9c1", tag: "ca5b9af2bb97" },
    { accountUUID: "9b04e221-ff04-4238-8b04", tag: "3bcfd7b519aa" },
    { accountUUID: "7e4f5568-4c6b-4237-9436", tag: "209358f9c8ec" },
    { accountUUID: "d42351c4-f6d4-4457-bcc1", tag: "7f1d24131e7a" },
    { accountUUID: "a0640085-670d-430e-a2fc", tag: "1ffce2604bb3" },
    { accountUUID: "ec12e66d-e4bc-4288-9f62", tag: "e731b763c899" },
    { accountUUID: "0d8f09c1-d83f-48c1-85d5", tag: "12864eb4e119" },
    { accountUUID: "2584cf4a-6289-4d59-91a2", tag: "0cf2e147de1d" },
    { accountUUID: "56f42eab-9d44-4967-b9db", tag: "80efd0345cf4" },
    { accountUUID: "89a77884-b30f-469e-a75b", tag: "8c76825a4423" },
    { accountUUID: "8656ae46-87a2-41b5-b064", tag: "2db2c41ae83e" },
    { accountUUID: "abef7432-d453-4345-b398", tag: "aed9f7c033c1" },
    { accountUUID: "5e74f83f-0fb0-4672-aa5a", tag: "df2c3fd9a7ea" },
    { accountUUID: "015b6200-a34e-4333-aa70", tag: "1f7b98bb7473" },
    { accountUUID: "52ad9ca9-fba5-4a1d-9ba3", tag: "93da25458b11" },
    { accountUUID: "61627ae9-add0-4479-b909", tag: "9a1402189059" },
    { accountUUID: "6d34ddca-b0a1-443f-a219", tag: "89b188d40d62" },
    { accountUUID: "a44f5d22-99aa-4d8f-b41b", tag: "52bb7c4ca907" },
    { accountUUID: "97afdd50-9bda-4cb2-8976", tag: "a705636a6b52" },
    { accountUUID: "616aa442-8786-402b-942e", tag: "218f9a1aa5a7" },
    { accountUUID: "53c3f7b3-6845-49ae-9150", tag: "44d249666e03" },
    { accountUUID: "ce75c881-f910-40e2-9026", tag: "f240e6949c8f" },
    { accountUUID: "bd08dd26-9861-4033-bf7c", tag: "5fe459be835b" },
    { accountUUID: "99fbd86a-659e-4ccd-8587", tag: "70c4777e0288" },
    { accountUUID: "c43d6715-f252-44fc-a14d", tag: "014668ddebd5" },
    { accountUUID: "ee8a7f40-c8fd-45b9-8013", tag: "d4dff050b91c" },
    { accountUUID: "515a9fa4-f768-4635-8199", tag: "4331997023ad" },
    { accountUUID: "45fa9a4b-9827-4d48-a723", tag: "7e232d031d78" },
    { accountUUID: "649a6001-cd18-4085-bd44", tag: "5bac0755f1d2" },
    { accountUUID: "c1de7005-1718-4626-8d8e", tag: "847609d4af24" },
    { accountUUID: "c125fbe3-37bd-4104-bbae", tag: "930f00dde659" },
    { accountUUID: "9aad6a5c-afaa-4a40-aec2", tag: "101aa0ad23cd" },
    { accountUUID: "462c9519-fd58-4fcc-835b", tag: "292d23941206" },
    { accountUUID: "b464785d-afc3-4429-9bf1", tag: "031599533d44" },
    { accountUUID: "65b33c72-b603-40a6-9ff8", tag: "757532e35c2c" },
    { accountUUID: "6ee6db5b-34a8-47bd-ac33", tag: "2c3752a777eb" },
    { accountUUID: "93987ec5-b2ed-46ea-bf43", tag: "6c2e6193a5f5" },
    { accountUUID: "77460dee-2943-4523-b24d", tag: "03a8bf13b22c" },
    { accountUUID: "1bbf60b2-667a-47b1-a6ae", tag: "1f8449fb814a" },
    { accountUUID: "4ef5f265-e08e-438c-be78", tag: "03c456c316ec" },
    { accountUUID: "dcfa256f-ef83-4cba-b0b6", tag: "b2fef9611f38" },
    { accountUUID: "06864c5a-68c5-4e90-8b9a", tag: "536eca375108" },
    { accountUUID: "b8c5a4a2-f3b9-4ded-bdc4", tag: "3ed18b11e7d6" },
    { accountUUID: "43a109ac-7e55-4edd-adaf", tag: "8558fb91d2eb" },
    { accountUUID: "55abeac9-eea4-4b93-998f", tag: "fad1ab45f547" },
    { accountUUID: "5e34ee0b-d32b-4a5e-914c", tag: "6b622ddf379d" },
    { accountUUID: "6895af44-b543-43f9-9ea7", tag: "5b4459ae52b8" },
    { accountUUID: "a0111d7a-b4f4-49d7-96c1", tag: "e88d15e85860" },
    { accountUUID: "6fe8b020-cc0f-4f6f-b7d0", tag: "b9e86d9de803" },
    { accountUUID: "4113fe5f-5e89-44e0-97ff", tag: "41066cdc3bde" },
    { accountUUID: "7d42ae21-3a5c-43d1-b4e3", tag: "fda795838c10" },
    { accountUUID: "e3d0ef13-89fc-403c-855e", tag: "34d452033b56" },
    { accountUUID: "fea26a02-eaa2-44f0-9ce2", tag: "9f4dbf4161b2" },
    { accountUUID: "932cd7c0-73aa-4708-bad4", tag: "92d146c30716" },
    { accountUUID: "2a6dd53b-458d-4cd0-91e7", tag: "4a369a3d43b3" },
    { accountUUID: "c7649a0e-bb5d-43a7-bf22", tag: "9203728b8c4f" },
    { accountUUID: "5373d88e-824b-42bc-8bd2", tag: "a118dd577b59" },
    { accountUUID: "abadbb33-7a06-44c0-82dd", tag: "f061d93e1969" },
    { accountUUID: "4faffb6f-58ad-4813-8265", tag: "e8eb4c20080d" },
    { accountUUID: "10ff9b71-b7d3-4214-bdc3", tag: "a1d174f536be" },
    { accountUUID: "0f45268e-f5ae-4a37-a777", tag: "3a50749cd4c5" },
    { accountUUID: "a66c5691-a9f4-4545-acd9", tag: "2839d8115c30" },
    { accountUUID: "61a6d166-95f2-4b88-ae25", tag: "992e89ce7bfd" },
    { accountUUID: "f52ff78c-033d-4ef7-8b84", tag: "5806475b37d2" },
    { accountUUID: "80c4adfe-fac2-4f92-a167", tag: "509e19911c48" },
    { accountUUID: "984bc2a4-238d-445f-a164", tag: "a36d6a9da2d3" },
    { accountUUID: "986fdbda-66f0-4eec-85d9", tag: "e3b75b908927" },
    { accountUUID: "1bfd9144-62e7-46eb-b061", tag: "66151ae19d65" },
    { accountUUID: "c9bd9cc2-75a8-4918-98c3", tag: "aad6ed3bed9c" },
    { accountUUID: "f143b781-f18d-45b6-b007", tag: "c9c045284061" },
    { accountUUID: "eb768a6f-ead1-482e-8d33", tag: "64e934485b83" },
    { accountUUID: "9e1c06fb-1eff-4292-aa1b", tag: "6b6d7e92ed7b" },
    { accountUUID: "8ba2ddee-a8b6-4c15-8bc5", tag: "afc49fd51a01" },
    { accountUUID: "14b810cd-c9fd-41c4-af9c", tag: "096c6222fd48" },
    { accountUUID: "439fd177-b6ad-47ba-84ac", tag: "6ca8147d92a7" },
    { accountUUID: "5ba153ef-500b-4663-97f0", tag: "2f3e77b26d91" },
    { accountUUID: "094b76ea-8d96-45dd-aaac", tag: "36fcc40bdeef" },
    { accountUUID: "7c597847-cc7a-419f-9818", tag: "f90f5dda835d" },
    { accountUUID: "42d2c6a0-744f-4d45-b982", tag: "00b766f483ef" },
    { accountUUID: "9e3446ce-36a9-4835-b98d", tag: "d2872b182465" },
    { accountUUID: "9e2f8f98-439f-4fc4-b9cd", tag: "6c8594300099" },
    { accountUUID: "beff8bfa-0296-425f-bde8", tag: "d6394a1b2cb2" },
    { accountUUID: "cc294613-834c-4d52-ad91", tag: "032c36a20839" },
    { accountUUID: "ff784daa-c4f3-40c2-b034", tag: "4f75b8e756df" },
    { accountUUID: "aa533a02-322f-405e-b5a0", tag: "28bd0918a829" },
    { accountUUID: "e92b00c7-29f2-4e21-8fa6", tag: "66cb07820b72" },
    { accountUUID: "57752d6a-dffe-41b9-aa30", tag: "2d6c469b56b2" },
    { accountUUID: "a67f2e8f-4d75-4b14-8fe5", tag: "f8868cc1bf43" },
    { accountUUID: "5bf42b3e-a22b-4af4-b041", tag: "0dc5a24bd8ea" },
    { accountUUID: "6df28a4d-fc7e-470d-ac4e", tag: "3e959e7e7a19" },
    { accountUUID: "285f883c-b985-4253-b156", tag: "80cd045efe6f" },
    { accountUUID: "2e0ab01f-93f3-461e-8c81", tag: "224af766b43c" },
    { accountUUID: "5d6df61b-95ac-4e94-9fba", tag: "7b5f50bcc853" },
    { accountUUID: "56a9ca95-dad9-4685-b7b7", tag: "88692b7ccdb2" },
    { accountUUID: "c0e03132-15eb-403d-b1cb", tag: "49c4c8cee7ac" },
    { accountUUID: "23be0057-d7bb-4895-be15", tag: "eb875ae83503" },
    { accountUUID: "3232d77f-a284-4904-ae3f", tag: "c82f8d26576e" },
    { accountUUID: "1edda1e8-cd5b-46ff-81be", tag: "b0600305f6af" },
    { accountUUID: "bfdc6c32-f406-40f5-9c22", tag: "aa710a9687dc" },
    { accountUUID: "f20fee06-f42a-4740-883c", tag: "2d5dc4d0869f" },
    { accountUUID: "ef0f7d6d-2811-4cfa-b320", tag: "eda96060cab7" },
    { accountUUID: "32da28d5-2308-4dfd-9718", tag: "392a5ab0ada9" },
    { accountUUID: "e032a0b9-1a5f-4f0a-b470", tag: "8e276bd396d5" },
    { accountUUID: "f1e37740-62f8-45c4-81eb", tag: "2d0d092607eb" },
    { accountUUID: "a31486fe-39a1-486c-aa69", tag: "9eecd55b85dc" },
    { accountUUID: "e98db219-04af-4cb8-80b7", tag: "3991ced80a38" },
    { accountUUID: "921372de-1680-45b4-a6c6", tag: "ed018c06d840" },
    { accountUUID: "790c43d6-b57e-4b79-b790", tag: "4badd5dbb2af" },
    { accountUUID: "84167d1d-dc96-48e9-bdf6", tag: "a59c2fb99835" },
    { accountUUID: "22840cd7-914d-4fee-af8e", tag: "51d3c26e2571" },
    { accountUUID: "01c12032-bc3c-49d5-a8be", tag: "ed3ee215fead" },
    { accountUUID: "c0e6ec88-d2ff-4eee-b228", tag: "e2671cca9570" },
    { accountUUID: "a37b4f77-f37d-4850-acba", tag: "2c14824cdaa6" },
    { accountUUID: "9eb89bb7-ad14-4bcd-8178", tag: "bfe126f71290" },
    { accountUUID: "7917f4f3-785d-42ac-bf25", tag: "1da17b3282bf" },
    { accountUUID: "9ead0300-3fa5-459d-8d44", tag: "0214257f1f87" },
    { accountUUID: "41b5fc08-67e6-4d2a-95e4", tag: "5dbf5adff56f" },
    { accountUUID: "51f1bcdb-0425-4546-8a5e", tag: "eaec6bd2eabb" },
    { accountUUID: "37f58604-a2da-456c-92ce", tag: "efb1217fc81b" },
    { accountUUID: "d5fb1366-6c02-436e-b8be", tag: "0ffdb0979ec0" },
    { accountUUID: "ae298b9d-53ce-45d2-bf04", tag: "ec5c7a91dd58" },
    { accountUUID: "27033bbf-ed15-4afb-8acf", tag: "5f5d65ee1f4d" },
    { accountUUID: "f3a67357-e4fd-4201-b983", tag: "5d5ce8a8e704" },
    { accountUUID: "cc5c08fd-762d-424a-a538", tag: "aee3c7b47649" },
    { accountUUID: "41a3d42e-af6b-45ba-af95", tag: "c4820e17254a" },
    { accountUUID: "951049be-5611-4e52-a6ae", tag: "16d67a4729e5" },
    { accountUUID: "3a04a7f8-f35a-4fe2-a936", tag: "de3f9b37f3b4" },
    { accountUUID: "ee334dde-67ed-4e5a-89ee", tag: "5718f5829109" },
    { accountUUID: "e3d8e817-55f8-4c28-9516", tag: "fc2470635a98" },
    { accountUUID: "962354cf-0973-43f2-a57a", tag: "8755f2880a90" },
    { accountUUID: "1e164bfc-e159-4a08-bdb9", tag: "33bcab41f593" },
    { accountUUID: "ce3e0c17-4298-419c-a69e", tag: "41ddc8acfe0a" },
    { accountUUID: "ff296ff0-eb39-4d96-b9b2", tag: "60b535e2d572" },
    { accountUUID: "ca606681-b704-4026-ae1d", tag: "fa8b01633687" },
    { accountUUID: "35d62d6f-e8a3-467a-a832", tag: "0dc21ff0237a" },
    { accountUUID: "9cdbc403-ae9e-4cf7-a40e", tag: "d29ae579ad5a" },
    { accountUUID: "ee87d6d2-0b1f-43fc-a9cf", tag: "052ad4e0c130" },
    { accountUUID: "dedc3f9b-743e-4b29-9b01", tag: "615a13e74ac6" },
    { accountUUID: "f5da66ba-015a-407b-a1e0", tag: "f3e16dbd8230" },
    { accountUUID: "888d9e23-027b-4ce2-aef7", tag: "53e5f992aed3" },
    { accountUUID: "e7a30c08-a63e-44fc-8907", tag: "9b37534da410" },
    { accountUUID: "39805dab-043b-40c3-be59", tag: "d55f4d07f89d" },
    { accountUUID: "3826850e-57de-4c41-ab65", tag: "2cf9f4016caf" },
    { accountUUID: "89b4b87d-9b91-495d-9cbf", tag: "886eb35e2461" },
    { accountUUID: "8b3c2684-1cb7-461d-aa78", tag: "3fc9733add1b" },
    { accountUUID: "5ed8700d-37e7-460b-bf28", tag: "bfe792f50432" },
    { accountUUID: "fa5ed13b-a79c-4b45-bf4a", tag: "b9963605aa44" },
    { accountUUID: "0f838f27-9ce4-4094-ba31", tag: "aa6241aac142" },
    { accountUUID: "f8b85b0e-f107-4295-ab4b", tag: "fe230a61af69" },
    { accountUUID: "7638596e-0487-4037-8162", tag: "0ff356d895c5" },
    { accountUUID: "ce8c094a-d244-401c-9d75", tag: "06861e6d2a66" },
    { accountUUID: "e49a0860-5872-4a27-90d8", tag: "ff6f9b6b2628" },
    { accountUUID: "4a40db6c-8ea7-4662-a09e", tag: "4356ba221120" },
    { accountUUID: "17dc464c-35aa-4e44-a5b3", tag: "bc60ba298217" },
    { accountUUID: "5aedc66f-6b5d-407d-8901", tag: "77571995fb29" },
    { accountUUID: "40ea144b-cae0-477b-b17b", tag: "617d2ec72e61" },
    { accountUUID: "7c76f983-11b0-43b0-b527", tag: "a45b799cdd8f" },
    { accountUUID: "6854c61f-0666-4200-b7d3", tag: "82cd907fd5c9" },
    { accountUUID: "c124dc2f-f766-4d79-a0b8", tag: "38dff5422e03" },
    { accountUUID: "1f992694-cb1a-4358-a383", tag: "85f999e72c51" },
    { accountUUID: "46e61e2e-a83f-404d-943f", tag: "f14ac3721a39" },
    { accountUUID: "00cbcb2e-4cb4-420e-b07a", tag: "4e75763cd47a" },
    { accountUUID: "18665378-9dbc-4fff-b539", tag: "babe78d646ac" },
    { accountUUID: "7569a98a-a76c-4186-85d9", tag: "8496297c554c" },
    { accountUUID: "0daab2fe-fb5a-4a8f-8607", tag: "b302062c69ff" },
    { accountUUID: "e0238b11-1a47-49dc-b0ef", tag: "92b7e403f95f" },
    { accountUUID: "273dbadc-5626-4b29-8eaa", tag: "7faaa910a8dc" },
    { accountUUID: "4bb48b83-2d6c-4618-9905", tag: "bcbd4c46cedc" },
    { accountUUID: "5a526c09-9b54-4ced-9355", tag: "41b4029be162" },
    { accountUUID: "cdf78b31-8a94-404d-8dc7", tag: "77965816510c" },
    { accountUUID: "da121b46-4825-4c02-b7f9", tag: "0c35e58fbedf" },
    { accountUUID: "77dccba2-ff71-43fb-b7ad", tag: "11d3a9a68a2c" },
    { accountUUID: "b1b01e81-16b5-4355-9360", tag: "44fafae06a6f" },
    { accountUUID: "1ed1e77e-71a4-4989-82d0", tag: "31436dd67e7d" },
    { accountUUID: "0d29989c-b4c3-4c6e-bc07", tag: "91c67dcc83a1" },
    { accountUUID: "7e4aa361-bf79-488a-86f3", tag: "66b6d5e84bdc" },
    { accountUUID: "67b23dbb-87c1-4e34-be5d", tag: "b5d337c0dc38" },
    { accountUUID: "b15664be-4a25-4ce0-ac73", tag: "86e335c1d40a" },
    { accountUUID: "dd63b707-174a-45d2-b2bb", tag: "9a4793772755" },
    { accountUUID: "0e1e3a60-1b9a-44c3-b282", tag: "f27a067e83b2" },
    { accountUUID: "b23faedd-5f56-44c0-9ce2", tag: "a43d9ca0fff1" },
    { accountUUID: "be164305-69f8-459b-9478", tag: "3bc01775e96f" },
    { accountUUID: "48ae64eb-9e4c-4d2e-99ef", tag: "0a77ee99c208" },
    { accountUUID: "7af94973-e666-4fea-a310", tag: "9875a052766c" },
    { accountUUID: "2dd6a0e0-e46b-463c-9b53", tag: "a255e8bc0779" },
    { accountUUID: "88a35249-b55e-4501-afcb", tag: "93d21d2ba83e" },
    { accountUUID: "89a4f75f-234a-4dbb-ba9b", tag: "54f932558ae6" },
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
                setIsSticky(e.intersectionRatio < 1);
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
