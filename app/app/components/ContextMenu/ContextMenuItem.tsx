import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export type ContextMenuItemProp = {
    className: "header" | "basic"; // depends on CSS => Use CSS module?
    name: string;
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
            className={`relative flex h-16 w-[260px] items-center bg-[color:var(--windows-glass)] px-0 py-2 shadow-[var(--blur)] hover:bg-[color:var(--controls-hover)] ${
                disabled ? "disable-select" : ""
            }`}
        >
            <div className="relative flex h-[19px] w-[260px] flex-col justify-center px-4 py-1">
                <div className="font-family: var(--headline-font-family) font-style: var(--headline-font-style) disable-select relative mb-[-0.5px] mt-[-2.5px] whitespace-nowrap text-start text-[length:var(--headline-font-size)] font-[number:var(--headline-font-weight)] leading-[var(--headline-line-height)] tracking-[var(--headline-letter-spacing)] text-[color:var(--text-invert)]">
                    {name}
                </div>
                {description && (
                    <div className="disable-select text-[color:var(--text-invert-secondary)]">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}

ContextMenuItem.propTypes = {
    menu_content: PropTypes.string,
    type: PropTypes.oneOf(["header", "basic"]),
};
