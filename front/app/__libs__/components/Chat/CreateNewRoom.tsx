import { Icon } from "@components/ImageLibrary";
import { useState } from "react";
import { ButtonOnRight } from "@components/Button/ButtonOnRight";
import { InviteList } from "@components/Service/InviteList";
import { TextField } from "@components/TextField";
import { ToggleButton } from "@components/Button/ToggleButton";
import { useWebSocket } from "@akasha-utils/react/websocket-hook";
import { ChatClientOpcode } from "@common/chat-opcodes";
import { digestMessage, encodeUTF8 } from "@akasha-lib";
import { SelectedAccountUUIDsAtom } from "@atoms/AccountAtom";
import { useAtom, useSetAtom } from "jotai";
import { useCurrentAccountUUID } from "@hooks/useCurrent";
import {
    CreateNewRoomCheckedAtom,
    CurrentChatRoomUUIDAtom,
} from "@atoms/ChatAtom";
import { GlobalStore } from "@atoms/GlobalStore";
import { makeCreateRoomRequest } from "@akasha-utils/chat-payload-builder-client";
import { handleCreateRoomResult } from "@akasha-utils/chat-gateway-client";
import { handleChatError } from "./handleChatError";
import { ChatErrorNumber } from "@common/chat-payloads";
import { useDetectSticky } from "@hooks/useDetectSticky";
import {
    CHAT_ROOM_TITLE_PATTERN,
    MAX_CHAT_MEMBER_CAPACITY,
} from "@common/chat-constants";

const defaultValue = {
    title: "",
    password: "",
    limit: 42,
    isPrivate: false,
    isSecret: false,
    isLimited: false,
    inviteChecked: false,
};

export function CreateNewRoom() {
    const currentAccountUUID = useCurrentAccountUUID();
    const [title, setTitle] = useState(defaultValue.title);
    const [password, setPassword] = useState(defaultValue.password);
    const [limit, setLimit] = useState(defaultValue.limit);
    const [privateChecked, setPrivateChecked] = useState(
        defaultValue.isPrivate,
    );
    const [secretChecked, setSecretChecked] = useState(defaultValue.isSecret);
    const [limitChecked, setLimitChecked] = useState(defaultValue.isLimited);
    const [inviteChecked, setInviteChecked] = useState(
        defaultValue.inviteChecked,
    );
    const setCreateNewRoomChecked = useSetAtom(CreateNewRoomCheckedAtom, {
        store: GlobalStore,
    });
    const setCurrentChatRoomUUID = useSetAtom(CurrentChatRoomUUIDAtom, {
        store: GlobalStore,
    });
    const [selectedAccountUUIDs, setSelectedAccountUUIDs] = useAtom(
        SelectedAccountUUIDsAtom,
    );
    const { sendPayload } = useWebSocket(
        "chat",
        ChatClientOpcode.CREATE_ROOM_RESULT,
        (_, buf) => {
            const [errno, chatId] = handleCreateRoomResult(buf);
            if (errno !== ChatErrorNumber.SUCCESS) {
                handleChatError(errno);
            } else {
                setTitle(defaultValue.title);
                setPassword(defaultValue.password);
                setLimit(defaultValue.limit);
                setPrivateChecked(defaultValue.isPrivate);
                setSecretChecked(defaultValue.isSecret);
                setLimitChecked(defaultValue.isLimited);
                setInviteChecked(defaultValue.inviteChecked);

                setCreateNewRoomChecked(false);
                setSelectedAccountUUIDs([]);
                setCurrentChatRoomUUID(chatId);
            }
        },
    );

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const inviteAccountUUIDs = [
            ...new Set([currentAccountUUID, ...selectedAccountUUIDs]),
        ];

        const sendCreateRoomRequestAsync = async () => {
            let passwordHash = "";
            if (secretChecked) {
                passwordHash = btoa(
                    String.fromCharCode(
                        ...(await digestMessage(
                            "SHA-256",
                            encodeUTF8(password),
                        )),
                    ),
                );
            }
            sendPayload(
                makeCreateRoomRequest(
                    title,
                    privateChecked,
                    passwordHash,
                    limit,
                    inviteAccountUUIDs,
                ),
            );
        };
        sendCreateRoomRequestAsync().catch(() => {});
    };

    return (
        <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="group h-full w-full overflow-auto"
        >
            <div className="flex h-full w-full flex-col justify-between gap-4 p-1">
                <div className="flex flex-col gap-2 self-stretch overflow-auto">
                    <div className="relative flex h-fit w-full flex-col gap-2 py-2">
                        <TextField
                            type="text"
                            className="relative min-h-[3rem] bg-black/30 px-4 py-1 text-xl"
                            placeholder="Title..."
                            pattern={CHAT_ROOM_TITLE_PATTERN}
                            name="chatRoomTitle"
                            required
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />

                        <div className="flex flex-col">
                            <SetIsPrivateToggle
                                privateChecked={privateChecked}
                                setPrivateChecked={setPrivateChecked}
                            />
                            <SetIsSecretToggle
                                secretChecked={secretChecked}
                                setSecretChecked={setSecretChecked}
                                password={password}
                                setPassword={setPassword}
                            />
                            <SetLimitToggle
                                limitChecked={limitChecked}
                                setLimitChecked={setLimitChecked}
                                limit={limit}
                                setLimit={setLimit}
                            />
                            <InviteFriendToggle
                                checked={inviteChecked}
                                setChecked={setInviteChecked}
                            />
                        </div>
                    </div>
                </div>
                <ButtonOnRight
                    buttonText="만들기"
                    className="relative flex rounded-lg bg-gray-700/80 p-3 text-lg outline-none  focus-within:outline-primary/70 group-valid:bg-green-500/50 hover:group-valid:bg-green-400/50 hover:group-valid:text-white active:group-valid:bg-green-300/50 active:group-valid:text-white"
                />
            </div>
        </form>
    );
}

function SetIsPrivateToggle({
    privateChecked,
    setPrivateChecked,
}: {
    privateChecked: boolean;
    setPrivateChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <ToggleButton
            id="private"
            name="isPrivate"
            checked={privateChecked}
            setChecked={setPrivateChecked}
            bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
            icon={
                <Icon.Lock
                    width={56}
                    height={56}
                    className={`rounded-xl p-4 transition-colors ${
                        privateChecked
                            ? "bg-secondary text-gray-50/80"
                            : "bg-gray-700/80 text-gray-50/50"
                    }`}
                />
            }
        >
            <div>
                <p className="relative text-sm">
                    {privateChecked ? "비공개" : "공개"}
                </p>
            </div>
        </ToggleButton>
    );
}

function SetIsSecretToggle({
    secretChecked,
    setSecretChecked,
    password,
    setPassword,
}: {
    secretChecked: boolean;
    setSecretChecked: React.Dispatch<React.SetStateAction<boolean>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <ToggleButton
            id="secret"
            name="isSecret"
            checked={secretChecked}
            setChecked={setSecretChecked}
            bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
            icon={
                <Icon.Key
                    width={56}
                    height={56}
                    className={`shrink-0 rounded-xl p-4 transition-colors ${
                        secretChecked
                            ? "bg-secondary text-gray-50/80"
                            : "bg-gray-700/80 text-gray-50/50"
                    }`}
                />
            }
        >
            <div className="flex flex-col gap-1">
                <div className="justify-center text-sm transition-all">
                    비밀번호
                </div>
                {secretChecked && (
                    <div className="relative flex h-full flex-col items-start justify-end gap-1 text-sm">
                        <TextField
                            type="new-password"
                            name="password"
                            placeholder="비밀번호 입력"
                            className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </div>
                )}
            </div>
        </ToggleButton>
    );
}

function SetLimitToggle({
    limitChecked,
    setLimitChecked,
    limit,
    setLimit,
}: {
    limitChecked: boolean;
    setLimitChecked: React.Dispatch<React.SetStateAction<boolean>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
}) {
    return (
        <ToggleButton
            id="limit"
            name="isLimit"
            checked={limitChecked}
            setChecked={setLimitChecked}
            bgClassName="gap-3 rounded p-3 hover:bg-gray-500/30"
            icon={
                <Icon.MembersFilled
                    width={56}
                    height={56}
                    className={`shrink-0 rounded-xl p-4 transition-colors ${
                        limitChecked
                            ? "bg-secondary text-gray-50/80"
                            : "bg-gray-700/80 text-gray-50/50"
                    }`}
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
                        name="limit"
                        disabled={!limitChecked}
                        min={1}
                        max={MAX_CHAT_MEMBER_CAPACITY}
                        placeholder="최대인원 입력"
                        className="bg-black/30 px-3 py-1 placeholder-gray-500/30"
                        value={limit}
                        onChange={(event) =>
                            setLimit(Number(event.target.value))
                        }
                    />
                </div>
            </div>
        </ToggleButton>
    );
}

function InviteFriendToggle({
    checked,
    setChecked,
}: {
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [isSticky, ref] = useDetectSticky<HTMLLabelElement>();

    return (
        <div className="flex flex-col gap-2">
            <label
                ref={ref}
                htmlFor="sectionHeader"
                className={`group sticky -top-1 z-10 flex h-fit w-full flex-row items-center gap-3 rounded p-3 transition-colors hover:bg-gray-500/30 hover:text-gray-50/80 ${
                    checked && isSticky ? "bg-secondary duration-0" : ""
                }`}
            >
                <Icon.Invite
                    width={56}
                    height={56}
                    className={`shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors ${
                        checked && "bg-secondary text-gray-50/80"
                    }`}
                />
                <input
                    onChange={(event) => setChecked(event.target.checked)}
                    checked={checked}
                    type="checkbox"
                    id="sectionHeader"
                    className="hidden"
                />
                <p className={`px-1 text-sm ${checked && "text-gray-50/80"}`}>
                    초대 상대 선택
                </p>
            </label>
            {checked && <InviteList filterUnjoined={false} />}
        </div>
    );
}
