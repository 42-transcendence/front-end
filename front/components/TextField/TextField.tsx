import React, { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    icon?: React.ReactNode | undefined;
    className?: string | undefined;
};

export function TextField<T extends TextFieldProps>(props: T) {
    // TODO: reconsider children position or purpose?
    const { icon, className, ...rest } = props;

    return (
        <div
            className={`${className} shadow-3xl group relative flex h-8 shrink-0 items-center justify-between gap-2 self-stretch rounded-xl bg-black/30`}
        >
            <input
                className="peer h-6 w-full resize-none border-[none] bg-transparent font-sans text-sm font-normal placeholder-gray-200/30 outline-none"
                {...rest}
            />
            {icon}
        </div>
    );
}
