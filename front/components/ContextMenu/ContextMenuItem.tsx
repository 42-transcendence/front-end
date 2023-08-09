import React from "react";
import "./style.css";

export type ContextMenuItemProp = {
    name: string;
    className: string;
    description?: string;
    disabled?: boolean;
};

export function ContextMenuItem({
    name,
    description,
    className,
    disabled,
}: ContextMenuItemProp): React.ReactElement {
    return (
        <div
            className={`relative flex h-16 w-[260px]  items-center bg-[color:var(--windows-glass)] px-0 py-2 shadow-[var(--blur)] hover:bg-primary/80 active:bg-secondary/80 ${
                disabled ? "select-none" : ""
            }`}
        >
            <div className="relative flex h-[19px] w-[260px] flex-col justify-center px-4 py-1">
                <div className={`${className} select-none`}>{name}</div>
                {description && (
                    <div className="select-none text-base text-purple-900">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}
