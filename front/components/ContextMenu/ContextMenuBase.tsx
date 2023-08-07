import React from "react";

export { ContextMenuItem } from "./ContextMenuItem";

export function ContextMenuBase({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string | undefined;
}) {
    return (
        <div className={`${className} flex flex-col items-center text-white`}>
            {children}
        </div>
    );
}
