"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, InputHTMLAttributes } from "react";
import { DoubleSharp } from "./ImageLibrary";

function SplashScreen({
    setIsMounted,
}: {
    setIsMounted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const divRef = useRef<HTMLDivElement>(null);

    // TODO: refactor
    const handleClick = () => {
        const divElement = divRef.current;
        if (divElement === null) return;

        divElement.classList.add("opacity-0");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        const divElement = divRef.current;
        if (divElement === null) return;

        if (event.key === "Enter" || event.key === " ") {
            divElement.classList.add("opacity-0");
        }
    };

    const handleTransition = () => {
        setIsMounted(false);
    };

    useEffect(() => {
        console.log("hello");
        window.addEventListener("keydown", handleKeyDown /* { once: true } */); // TODO: check if neccessary
        window.addEventListener("click", handleClick /* { once: true } */);

        return () => {
            console.log("bye");
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <div ref={divRef} className="transition-opacity duration-500">
            <FrontPage onTransitionEnd={handleTransition}></FrontPage>
        </div>
    );
}

// TODO: rename
export function ClickToDisappear() {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(true);

    const isRootPage = pathname === "/";

    // TODO: add timeout?

    return (
        <>
            {isRootPage && isMounted ? (
                <SplashScreen setIsMounted={setIsMounted} />
            ) : null}
        </>
    );
}

function FrontPage(props: InputHTMLAttributes<HTMLDivElement>) {
    const { ...rest } = props;

    return (
        <div
            className="absolute z-10 flex h-full w-full flex-col items-center justify-center bg-main bg-cover"
            {...rest}
        >
            <div className="flex h-full flex-col justify-center">
                <DoubleSharp
                    width={200}
                    height={200}
                    className="drop-shadow-[0_0_1rem_#ffffff70]"
                />
            </div>

            <div className="h-1/5">
                <div className="flex h-12 w-56 items-center justify-center rounded-[28px_28px_0_0] bg-white font-sans text-3xl font-extrabold text-black">
                    Game Start
                </div>
            </div>
        </div>
    );
}
