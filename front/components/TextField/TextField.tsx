import React, { HTMLInputTypeAttribute } from "react";

export function TextField({
    icon,
    value,
    type,
    placeholder,
    onChange,
    className,
}: {
    icon?: React.ReactNode | undefined;
    value: string;
    type: HTMLInputTypeAttribute;
    placeholder?: string | undefined;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    className?: string | undefined;
}) {
    // TODO: reconsider children position or purpose?
    return (
        <form
            className={`shadow-3xl group relative flex h-8 shrink-0 items-center justify-between gap-2 self-stretch rounded-xl bg-black/30 ${className}`}
        >
            <input
                className="peer h-6 w-full resize-none border-[none] bg-transparent font-sans text-sm font-normal placeholder-gray-200/30 outline-none"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {icon}
        </form>
    );
}
