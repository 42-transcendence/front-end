"use client";
import React from "react";
import FtLogo from "/public/42Logo.svg";

export function FtLoginButton({}): React.ReactElement {
    if (window) {
        const popupLink = () => {
            window.open(
                "https://accounts.google.com/gsi/select?client_id=990339570472-k6nqn1tpmitg8pui82bfaun3jrpmiuhs.apps.googleusercontent.com&auto_select=true&ux_mode=popup&ui_mode=card&context=signin&as=PbXs9bDCM2TVCG7QFPY%2FBA&channel_id=6452d8a3f9ee221df174e4dd671e46d81d580ec363f33016aa70433ad30c3b8c",
                "42 Login",
                "popup=true, width=500, height=500",
            );
        };
        return (
            <>
                <button
                    type="button"
                    onClick={popupLink}
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
    return <>fail</>;
}
