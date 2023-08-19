"use client";

import {
    Dispatch,
    LabelHTMLAttributes,
    ReactElement,
    ReactNode,
    SetStateAction,
} from "react";

type ToggleButtonProp = LabelHTMLAttributes<HTMLLabelElement> & {
    id: string;
    bgClassName?: string;
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>;
    icon: ReactElement;
    children: ReactNode;
};

export function ToggleButton(props: ToggleButtonProp) {
    const { id, icon, bgClassName, checked, setChecked, children, ...rest } =
        props;

    return (
        <label
            htmlFor={id}
            data-checked={checked}
            className={`group relative flex w-full flex-row items-center ${bgClassName}`}
            {...rest}
        >
            {icon}
            <input
                onChange={() => {
                    setChecked(!checked);
                }}
                checked={checked}
                type="checkbox"
                id={id}
                className="hidden"
            />
            {children}
        </label>
    );
}
