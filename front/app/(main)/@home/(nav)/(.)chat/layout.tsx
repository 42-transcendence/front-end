"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, useRef } from "react";

//TODO outside click
export default function ModalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const divRef = useRef<HTMLDivElement>(null);

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

    const onClick = useCallback(
        (e: MouseEvent) => {
            const elem = divRef.current;

            if (elem === null) {
                return;
            }

            const target = e.target;

            if (!(target instanceof Element)) {
                return;
            }

            if (elem.contains(target)) {
                return;
            }

            onDismiss();
            e.preventDefault();
        },
        [onDismiss],
    );

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("click", onClick);
        };
    }, [onKeyDown, onClick]);

    return (
        <div
            ref={divRef}
            className="absolute inset-0 flex h-full w-full flex-col font-extrabold"
        >
            {children}
        </div>
    );
}
