import React from "react";

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
        <div className="shadow-3xl group relative flex h-8 shrink-0 items-center justify-between gap-2 self-stretch rounded-xl bg-black/30 py-1 pl-7 pr-2 transition-all focus-within:pl-2 focus-within:pr-9">
            <input
                className="h-6 w-full resize-none border-[none] bg-transparent font-sans text-sm font-normal placeholder-gray-200/80 outline-none"
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {children}
        </div>
    );
}
