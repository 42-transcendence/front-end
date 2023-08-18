"usee client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

function SplashScreen({
    setIsMounted
}: {
    setIsMounted: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const divRef = useRef<HTMLDivElement>(null);

    // TODO: refactor
    const handleClick = () => {
        const divElement = divRef.current;
        if (divElement === null) return;

        divElement.classList.add("opacity-0");
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        const divElement = divRef.current;
        if (divElement === null) return;

        if (event.key === "Enter" || event.key === " ") {
            divElement.classList.add("opacity-0");
        }
    }

    const handleTransition = () => {
        setIsMounted(false);
    }

    useEffect(() => {
        console.log("hello");
        window.addEventListener("keydown", handleKeyDown, /* { once: true } */); // TODO: check if neccessary
        window.addEventListener("click", handleClick, /* { once: true } */);

        return () => {
            console.log("bye");
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", handleClick);
        }
    }, []);

    return (
        <div
            ref={divRef}
            className="z-10 transition-opacity bg-windowGlass/30 duration-500 bg-green-600 absolute h-full w-full"
            onTransitionEnd={handleTransition}
        >
            click to start / press Enter
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
            {isRootPage && isMounted ?
                <SplashScreen setIsMounted={setIsMounted} />
                : null}
        </>
    );
}
