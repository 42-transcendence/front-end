import React from "react";

// import { useState } from "react";
// import { chatRoomsDummy } from "../Chat/ChatSideBar";

export function TextField({
    children,
    value,
    placeholder,
    onChange,
}: {
    children: React.ReactNode;
    value: string;
    placeholder?: string | undefined;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
}) {
    // TODO: reconsider children position or purpose?
    return (
        <div className="shadow-3xl relative flex h-8 shrink-0 items-center justify-between gap-2 self-stretch rounded-xl bg-black/30 px-2 py-[5px]">
            <div className="relative flex h-fit shrink-0 items-center justify-start gap-2 self-stretch rounded-xl px-2 py-0 ">
                <div className="flex h-fit flex-col justify-start gap-2 overflow-hidden text-ellipsis text-sm font-normal not-italic leading-[22px] text-gray-200/90">
                    <input
                        className="border-[none] bg-transparent outline-none"
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />
                </div>
            </div>
            {children}
        </div>
    );
}

export function SearchBox() {
    return (
        <div className="shadow-3xl relative flex h-8 shrink-0 items-center justify-between gap-2 self-stretch rounded-xl bg-black/30 px-2 py-[5px]">
            <div className="relative flex h-fit shrink-0 items-center justify-start gap-2 self-stretch rounded-xl px-2 py-0 ">
                {/* <Icon className="float-left" type="search" size={30} /> */}
            </div>
        </div>
    );
}
