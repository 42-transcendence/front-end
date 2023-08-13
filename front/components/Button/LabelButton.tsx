"use client";

import {
    LabelHTMLAttributes,
    ReactElement,
    ReactNode,
    useEffect,
    useState,
} from "react";

type ToggleButtonProp = LabelHTMLAttributes<HTMLLabelElement> & {
    id: string;
    icon: ReactElement;
    children: ReactNode;
};

export function ToggleButton(props: ToggleButtonProp) {
    const [state, setState] = useState(false);
    const { id, icon, children, ...rest } = props;

    return (
        <label
            htmlFor={id}
            aria-checked={state}
            className="group relative flex w-full flex-row items-center gap-3 rounded-xl p-3 hover:bg-gray-500/30"
            {...rest}
        >
            <input
                onChange={() => {
                    setState(!state);
                }}
                checked={state}
                type="checkbox"
                id={id}
                className={``}
            />
            {icon}
            {children}
        </label>
    );
}
