"use client";
import { useRef, useEffect } from "react";
import React from "react";
import FtLogo from "/public/42logo.svg";

export function FtLoginButton({}): React.ReactElement {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const buttonElement = buttonRef.current;

        if (buttonElement === null) return;

        const url = new URL("https://accounts.google.com/gsi/select");
        const params = new URLSearchParams({
            client_id:
                "990339570472-k6nqn1tpmitg8pui82bfaun3jrpmiuhs.apps.googleusercontent.com",
            as: "PbXs9bDCM2TVCG7QFPY%2FBA",
            channel_id:
                "6452d8a3f9ee221df174e4dd671e46d81d580ec363f33016aa70433ad30c3b8c",
            auto_select: "true",
            ux_mode: "popup",
            ui_mode: "card",
            context: "signin",
        });

        url.search = params.toString();

        const target = "42 Login";
        const features = "popup=true, width=600, height=600";

        const popupLink = () => {
            window.open(url, target, features);
        };

        buttonElement.addEventListener("click", popupLink);

        return () => {
            if (buttonElement !== null) {
                buttonElement.removeEventListener("click", popupLink);
            }
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
                    <FtLogo width={17} height="100%" />
                    <p className="font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Sign in with 42
                    </p>
                </div>
            </button>
        </>
    );
}
