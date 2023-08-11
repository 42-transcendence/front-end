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
            className={`relative ${className} flex h-fit w-full items-center rounded py-3 hover:bg-primary/30 active:bg-secondary/80 `}
        >
            <div className="relative flex w-full flex-col justify-center px-4 py-1">
                <div className={` select-none`}>{name}</div>
                {description && (
                    <div className="select-none text-base text-purple-900">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}
