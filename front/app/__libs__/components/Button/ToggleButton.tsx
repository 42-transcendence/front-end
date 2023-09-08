"use client";

type ToggleButtonProp = React.LabelHTMLAttributes<HTMLLabelElement> & {
    id: string;
    name: string;
    bgClassName?: string;
    checked: boolean;
    setChecked: React.Dispatch<React.SetStateAction<boolean>>;
    icon?: React.ReactElement | undefined;
    children: React.ReactNode;
};

export function ToggleButton(props: React.PropsWithChildren<ToggleButtonProp>) {
    const {
        id,
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
                name={name}
                type="checkbox"
                id={id}
                className="peer hidden"
            />
            {children}
        </label>
    );
}
