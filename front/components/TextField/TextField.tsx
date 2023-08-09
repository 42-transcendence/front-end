import React from "react";

export function TextField({
    children,
    value,
    placeholder,
    onChange,
    className,
    max,
}: {
    children?: React.ReactNode;
    value: string;
    placeholder?: string | undefined;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    className?: string;
    max?: number | undefined;
}) {
    // TODO: reconsider children position or purpose?
    return (
        <form
            className={`shadow-3xl group relative flex h-8 shrink-0 items-center justify-between gap-2 self-stretch rounded-xl bg-black/30 ${className}`}
        >
            <input
                min="1"
                max={max}
                className="peer h-6 w-full resize-none border-[none] bg-transparent font-sans text-sm font-normal placeholder-gray-200/80 outline-none"
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {children}
        </form>
    );
}
