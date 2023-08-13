"use client";

import { FormEventHandler, useState } from "react";
import { TextField } from "../TextField";
import { IconKey, IconLock, IconMembers } from "../ImageLibrary";

export function CreateNewRoom({ className }: { className: string }) {
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");
    const [limit, setLimit] = useState(1);
    const [privateChecked, setPrivateChecked] = useState(false);
    const [passwordChecked, setPasswordChecked] = useState(false);
    const [limitChecked, setLimitChecked] = useState(false);

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        //TODO: make new room with title, password, limit;
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
                                className="group-aria relative bg-transparent text-xl"
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
                        {/* */}

                        <div className="flex w-full flex-col py-3 transition-all">
                            <label
                                htmlFor="private"
                                aria-checked={privateChecked}
                                className="group relative flex w-full flex-row items-center gap-3 rounded-xl p-3 hover:bg-gray-500/30"
                            >
                                {
                                    <IconLock
                                        width={56}
                                        height={56}
                                        className="rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-aria-checked:bg-secondary group-aria-checked:text-gray-50/80"
                                    />
                                }
                                <input
                                    onChange={() => {
                                        setPrivateChecked(!privateChecked);
                                    }}
                                    checked={privateChecked}
                                    type="checkbox"
                                    id="private"
                                    className={`hidden`}
                                />
                                <div>
                                    <p className="relative text-sm group-aria-checked:hidden">
                                        공개
                                    </p>
                                    <p className="relative hidden text-sm group-aria-checked:block">
                                        비공개
                                    </p>
                                </div>
                            </label>

                            <label
                                htmlFor="secret"
                                aria-checked={passwordChecked}
                                className="group relative flex w-full flex-row items-center gap-3 rounded-xl p-3 hover:bg-gray-500/30"
                            >
                                {
                                    <IconKey
                                        width={56}
                                        height={56}
                                        className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-aria-checked:bg-secondary group-aria-checked:text-gray-50/80"
                                    />
                                }
                                <input
                                    onChange={() => {
                                        setPasswordChecked(!passwordChecked);
                                    }}
                                    checked={passwordChecked}
                                    type="checkbox"
                                    id="secret"
                                    className="hidden"
                                />
                                <div className="flex flex-col gap-1">
                                    <div className="items-end justify-center text-sm transition-all">
                                        비밀번호
                                    </div>
                                    <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-aria-checked:flex">
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
                            </label>

                            <label
                                htmlFor="limit"
                                aria-checked={limitChecked}
                                className="group relative flex w-full flex-row items-center gap-3 rounded-xl p-3 hover:bg-gray-500/30"
                            >
                                {
                                    <IconMembers
                                        width={56}
                                        height={56}
                                        className="shrink-0 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors group-aria-checked:bg-secondary group-aria-checked:text-gray-50/80"
                                    />
                                }
                                <input
                                    onChange={() => {
                                        setLimitChecked(!limitChecked);
                                    }}
                                    checked={limitChecked}
                                    type="checkbox"
                                    id="limit"
                                    className="hidden"
                                />
                                <div className="flex flex-col gap-1">
                                    <div className="items-end justify-center text-sm transition-all">
                                        인원제한
                                    </div>
                                    <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm group-aria-checked:flex">
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
                            </label>
                        </div>
                    </div>
                    {/*TODO: Add freind list */}
                </div>

                <div className="relative w-full rounded-xl p-3 hover:bg-gray-500/30">
                    <div className="flex w-full justify-center rounded-lg bg-gray-700/80 p-3 group-valid:bg-green-700/80">
                        만들기
                    </div>
                </div>
            </div>
        </form>
    );
}
