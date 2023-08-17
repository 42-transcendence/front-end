import React, { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    icon?: React.ReactNode | undefined;
    className?: string | undefined;
};

export function TextField(props: TextFieldProps) {
    // TODO: reconsider children position or purpose?
    const { icon, className, ...rest } = props;

    return (
        <fieldset
            className={`${className} shadow-3xl group relative flex h-8 shrink-0 items-center justify-center gap-2 self-stretch rounded-xl bg-black/30 py-1`}
        >
            <input
                className="peer h-6 w-full resize-none border-[none] bg-transparent font-sans font-normal placeholder-gray-200/30 outline-none"
                {...rest}
            />
            {icon}
        </fieldset>
    );
}
