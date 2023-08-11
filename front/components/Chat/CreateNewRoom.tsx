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
            className={`${className} absolute right-0 top-24 z-50 flex h-full w-full flex-col gap-4 rounded-[28px_28px_0px_0px] bg-gray-800 p-4`}
        >
            <div>
                <TextField
                    type="search"
                    className="relative bg-transparent p-3 transition-all focus-within:py-5"
                    placeholder="Title..."
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                />
                <hr className="border-gray-200/50" />
            </div>

            <div className="relative flex flex-row items-center gap-3">
                <input
                    type="checkbox"
                    id="private"
                    className="peer/private hidden"
                />
                <label
                    htmlFor="private"
                    className=" gap-2 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors peer-checked/private:bg-secondary peer-checked/private:text-gray-50/80"
                >
                    <IconLock width={24} height={24} className="" />
                </label>
                <p className="text-sm peer-checked/private:hidden">공개</p>
                <p className="hidden text-sm peer-checked/private:block">
                    비공개
                </p>
            </div>
            <div className="relative flex w-full flex-row items-start gap-3">
                <input
                    type="checkbox"
                    id="secret"
                    className="peer/secret hidden"
                />
                <label
                    htmlFor="secret"
                    className=" gap-2 rounded-xl bg-gray-700/80 p-4 text-gray-50/50 transition-colors peer-checked/secret:bg-secondary peer-checked/secret:text-gray-50/80"
                >
                    <IconKey width={24} height={24} className="" />
                </label>

                <div className="absolute left-[4.25rem] top-4 items-end justify-center text-sm transition-all peer-checked/secret:absolute peer-checked/secret:left-[4.25rem] peer-checked/secret:top-0">
                    비밀번호
                </div>
                <div className="relative hidden h-full flex-col items-start justify-end gap-1 text-sm peer-checked/secret:flex">
                    <TextField
                        type="password"
                        placeholder="..."
                        className="bg-black/30 p-4 placeholder-gray-500/30"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
