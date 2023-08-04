"use client";

import { useRef, useEffect } from "react";
import GoogleLogo from "/public/googleLogo.svg";

export function GoogleLoginButton({}): React.ReactElement {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const buttonElement = buttonRef.current;

        if (buttonElement === null) return;

        const url = new URL("https://front.stri.dev/auth/google");
        const target = "Google Login";
        const features = ["popup=true", "width=600", "height=600"].join(",");

        const popupLink = () => {
            window.open(url, target, features);
        };

        buttonElement.addEventListener("click", popupLink);

        return () => {
            buttonElement.removeEventListener("click", popupLink);
        };
    }, []);

    return (
        <>
            <button
                type="button"
                ref={buttonRef}
                className="gradient-border flex h-12 w-48 flex-col justify-center rounded bg-windowGlass/30 px-4 py-[1px] backdrop-blur-[20px] backdrop-brightness-100 before:absolute before:inset-0 before:rounded before:p-px before:content-[''] hover:bg-controlsSelected dark:bg-black/30"
            >
                <div className="flex items-center gap-2 py-2.5">
                    <GoogleLogo width={17} height="100%" />
                    <p className="font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Sign in with Google
                    </p>
                </div>
            </button>
        </>
    );
}
