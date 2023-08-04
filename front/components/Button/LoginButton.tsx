"use client";

import { useRef, useEffect } from "react";
import React from "react";

export function LoginButton({
    children,
    icon,
    onClick,
}: React.PropsWithChildren<{
    icon?: React.ReactElement | undefined;
    onClick: (this: HTMLButtonElement, ev: MouseEvent) => void;
}>) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const buttonElement = buttonRef.current;

        if (buttonElement === null) return;

        buttonElement.addEventListener("click", onClick);

        return () => {
            buttonElement.removeEventListener("click", onClick);
        };
    }, [onClick]);

    return (
        <button
            type="button"
            ref={buttonRef}
            className="gradient-border flex h-12 w-48 flex-col justify-center rounded bg-windowGlass/30 px-4 py-[1px] backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded before:p-px before:content-[''] hover:bg-controlsSelected dark:bg-black/30"
        >
            <div className="flex items-center gap-2 py-2.5">
                {icon}
                <p className="font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {children}
                </p>
            </div>
        </button>
    );
}
