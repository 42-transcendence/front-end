"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";

export default function ModalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onDismiss();
            }
        },
        [onDismiss],
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onKeyDown]);

    return (
        <div className="absolute inset-0 flex h-full w-full flex-col font-extrabold">
            {children}
        </div>
    );
}
