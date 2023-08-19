"use client";

//TODO: 인터셉트 된 페이지랑 직접 접속한 페이지 구분
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

    // useOutsideClick(divRef, onDismiss, true);

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <div
            ref={divRef}
            className="absolute inset-0 flex h-full w-full flex-col font-extrabold"
        >
            {children}
        </div>
    );
}
