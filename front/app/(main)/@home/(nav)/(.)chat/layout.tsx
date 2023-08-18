"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useCallback, useRef } from "react";

function useOutsideClick(
    divRef: React.RefObject<HTMLElement>,
    callback: () => void,
    preventDefault: boolean,
) {
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

            callback();
            preventDefault && e.preventDefault();
        },
        [callback],
    );

    useEffect(() => {
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
        };
    }, [onClick]);
}

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

    useOutsideClick(divRef, onDismiss, true);

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
