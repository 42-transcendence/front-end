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
    formID: string;
    name: string;
    bgClassName?: string;
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>;
    icon: ReactElement;
    children: ReactNode;
};

export function ToggleButton(props: ToggleButtonProp) {
    const {
        id,
        formID,
        name,
        icon,
        bgClassName,
        checked,
        setChecked,
        children,
        ...rest
    } = props;

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
                form={formID}
                name={name}
                type="checkbox"
                id={id}
                className="hidden"
            />
            {children}
        </label>
    );
}
