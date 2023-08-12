"use client";

import { useState } from "react";
import LockIcon from "/public/lock.svg";
import { TextField } from "../TextField";
import { IconKey, IconLock } from "../ImageLibrary";

export function CreateNewRoom({ className }: { className: string }) {
    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div
            className={`${className} absolute right-0 top-24 z-50 flex h-full w-full flex-col gap-2 rounded-[28px_28px_0px_0px] bg-gray-800 p-4`}
        >
            <form className="flex flex-col items-center p-3">
                <TextField
                    type="search"
                    className="relative bg-transparent text-3xl"
                    placeholder="Title..."
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                />
                <hr className="mx-3 w-full border-gray-200/30 transition-all " />
            </form>

            <label
                htmlFor="private"
                className="relative flex w-full flex-row items-center gap-3 rounded-xl p-3 hover:bg-gray-200/30"
            >
                <input
                    type="checkbox"
                    id="private"
                    className="peer/private hidden"
                />
                <IconLock
                    width={56}
                    height={56}
                    className="ext-gray-50/50 rounded-xl bg-gray-700/80 p-4 transition-colors peer-checked/private:bg-secondary peer-checked/private:text-gray-50/80"
                />
                <p className="relative text-sm peer-checked/private:hidden">
                    공개
                </p>
                <p className="relative hidden text-sm peer-checked/private:block">
                    비공개
                </p>
            </label>

            <label
                htmlFor="secret"
                className="relative flex w-full flex-row items-start gap-3 rounded-xl p-3 hover:bg-gray-200/30"
            >
                <input
                    type="checkbox"
                    id="secret"
                    className="peer/secret hidden"
                />
                <IconKey
                    width={56}
                    height={56}
                    className="ext-gray-50/50 rounded-xl bg-gray-700/80 p-4 transition-colors peer-checked/secret:bg-secondary peer-checked/secret:text-gray-50/80"
                />
                <div className="absolute left-[5rem] top-7 items-end justify-center text-sm transition-all peer-checked/secret:absolute peer-checked/secret:left-[5rem] peer-checked/secret:top-3">
                    비밀번호
                </div>
                <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm peer-checked/secret:flex">
                    <TextField
                        type="password"
                        placeholder="비밀번호 입력"
                        className="bg-black/30 p-4 placeholder-gray-500/30"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                </div>
            </label>
        </div>
    );
}
