"use client";

import { FormEventHandler, useContext, useState } from "react";
import { TextField } from "@/components/TextField";
import { IconKey, IconLock, IconMembers } from "@/components/ImageLibrary";
import { ToggleButton } from "@/components/Button/ToggleButton";
import { ChatRoomMode, CreateChat } from "@/utils/utils";
import { SocketContext } from "@/app/main/@main/SocketContext";
import { sendCreateRoom } from "@/utils/clientUtils";

export function CreateNewRoom({ className }: { className: string }) {
    const webSocket: WebSocket | undefined = useContext(SocketContext);
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");
    const [limit, setLimit] = useState(1);
    const [privateChecked, setPrivateChecked] = useState(false);
    const [passwordChecked, setPasswordChecked] = useState(false);
    const [limitChecked, setLimitChecked] = useState(false);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (webSocket === undefined) {
            console.log("undefined");
            return;
        }
        const createRoom: CreateChat = {
            chat: {
                title: title,
                modeFlags: (privateChecked ? ChatRoomMode.PRIVATE : 0) | (passwordChecked ? ChatRoomMode.SECRET : 0),
                password: password,
                limit: (limitChecked ? limit : 1500)
            },
            members: []
        }
        console.log("here");
        sendCreateRoom(webSocket, createRoom);
    };

    return (
        <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className={` ${className} group relative h-full w-full`}
        >
            <div className="flex h-full flex-col justify-between">
                <div>
                    <div className="h-full rounded-[28px_28px_0px_0px]">
                        <div className="w-full p-3">
                            <TextField
                                type="text"
                                className="relative bg-transparent text-xl"
                                placeholder="Title..."
                                pattern=".{4,32}"
                                required
                                value={title}
                                onChange={(event) => {
                                    setTitle(event.target.value);
                                }}
                            />
                            <hr className="w-full border-gray-50/30 transition-all peer-focus-within:border-t-2 peer-focus-within:border-gray-50/70" />
                        </div>

                        <div className="flex w-full flex-col py-3 transition-all">
                            <ToggleButton
                                id="private"
                                checked={privateChecked}
                                setChecked={setPrivateChecked}
                                bgClassName="gap-3 rounded-xl p-3 hover:bg-gray-500/30"
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
                                bgClassName="gap-3 rounded-xl p-3 hover:bg-gray-500/30"
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
                                                setPassword(event.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </ToggleButton>

                            <ToggleButton
                                id="limit"
                                checked={limitChecked}
                                setChecked={setLimitChecked}
                                bgClassName="gap-3 rounded-xl p-3 hover:bg-gray-500/30"
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
                                                    Number(event.target.value),
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </ToggleButton>
                        </div>
                    </div>
                    {/*TODO: Add freind list */}
                </div>

                <div className="relative w-full rounded-xl p-3 hover:bg-gray-500/30">
                    <button className="flex w-full justify-center rounded-lg bg-gray-700/80 p-3 group-valid:bg-green-700/80">
                        만들기
                    </button>
                </div>
            </div>
        </form>
    );
}
